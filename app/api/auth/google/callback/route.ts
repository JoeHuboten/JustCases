import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { createToken } from '@/lib/auth-utils';
import { createLogger, getRequestId, getSafeErrorDetails } from '@/lib/logger';

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

interface GoogleUserInfo {
  sub: string;         // Google user ID
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request.headers);
  const logger = createLogger('api:auth:google:callback').withRequestId(requestId);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    const { searchParams } = request.nextUrl;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Retrieve stored state from cookie
    const storedState = request.cookies.get('google-oauth-state')?.value;
    const callbackUrl = request.cookies.get('google-oauth-callback')?.value || '/account';

    // Handle errors from Google
    if (error) {
      logger.warn('Google OAuth error', { error });
      return NextResponse.redirect(`${appUrl}/auth/signin?error=google_denied`);
    }

    // Validate state parameter (CSRF check)
    if (!state || !storedState || state !== storedState) {
      logger.warn('Google OAuth state mismatch');
      return NextResponse.redirect(`${appUrl}/auth/signin?error=invalid_state`);
    }

    if (!code) {
      return NextResponse.redirect(`${appUrl}/auth/signin?error=no_code`);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      logger.error('Google OAuth credentials not configured');
      return NextResponse.redirect(`${appUrl}/auth/signin?error=config_error`);
    }

    const redirectUri = `${appUrl}/api/auth/google/callback`;

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      logger.error('Google token exchange failed', { status: tokenResponse.status, body: errorData });
      return NextResponse.redirect(`${appUrl}/auth/signin?error=token_exchange`);
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json();

    // Fetch user profile from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoResponse.ok) {
      logger.error('Google userinfo fetch failed');
      return NextResponse.redirect(`${appUrl}/auth/signin?error=userinfo_failed`);
    }

    const googleUser: GoogleUserInfo = await userInfoResponse.json();

    if (!googleUser.email) {
      logger.error('Google account has no email');
      return NextResponse.redirect(`${appUrl}/auth/signin?error=no_email`);
    }

    // Check if an Account record already exists for this Google account
    let account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'google',
          providerAccountId: googleUser.sub,
        },
      },
      include: { user: true },
    });

    let user;

    if (account) {
      // Existing Google-linked account — update tokens
      user = account.user;
      await prisma.account.update({
        where: { id: account.id },
        data: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token ?? account.refresh_token,
          expires_at: tokens.expires_in
            ? Math.floor(Date.now() / 1000) + tokens.expires_in
            : undefined,
          id_token: tokens.id_token,
          token_type: tokens.token_type,
          scope: tokens.scope,
        },
      });
    } else {
      // Check if a user with this email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: googleUser.email },
      });

      if (existingUser) {
        // Link Google account to the existing user
        user = existingUser;
        await prisma.account.create({
          data: {
            userId: existingUser.id,
            type: 'oauth',
            provider: 'google',
            providerAccountId: googleUser.sub,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: tokens.expires_in
              ? Math.floor(Date.now() / 1000) + tokens.expires_in
              : undefined,
            id_token: tokens.id_token,
            token_type: tokens.token_type,
            scope: tokens.scope,
          },
        });

        // Update profile info if missing
        if (!existingUser.image || !existingUser.name) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: existingUser.name || googleUser.name,
              image: existingUser.image || googleUser.picture,
              emailVerified: existingUser.emailVerified || new Date(),
            },
          });
          // Re-fetch for the updated data
          user = await prisma.user.findUnique({ where: { id: existingUser.id } });
        }
      } else {
        // Create brand-new user + account
        user = await prisma.user.create({
          data: {
            email: googleUser.email,
            name: googleUser.name,
            image: googleUser.picture,
            emailVerified: new Date(),
            accounts: {
              create: {
                type: 'oauth',
                provider: 'google',
                providerAccountId: googleUser.sub,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: tokens.expires_in
                  ? Math.floor(Date.now() / 1000) + tokens.expires_in
                  : undefined,
                id_token: tokens.id_token,
                token_type: tokens.token_type,
                scope: tokens.scope,
              },
            },
          },
        });
      }
    }

    if (!user) {
      logger.error('Failed to create or find user');
      return NextResponse.redirect(`${appUrl}/auth/signin?error=user_creation_failed`);
    }

    // Issue JWT — same as the regular sign-in flow
    const jwt = await createToken(
      user.id,
      user.email!,
      user.role,
      user.tokenVersion
    );

    const response = NextResponse.redirect(`${appUrl}${callbackUrl}`);

    // Set auth cookie (7 days, same as "remember me")
    response.cookies.set('auth-token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    // Clean up OAuth cookies
    response.cookies.delete('google-oauth-state');
    response.cookies.delete('google-oauth-callback');

    logger.info('Google OAuth sign-in successful', { userId: user.id });
    return response;
  } catch (err) {
    logger.error('Google OAuth callback error', { error: getSafeErrorDetails(err) });
    return NextResponse.redirect(`${appUrl}/auth/signin?error=server_error`);
  }
}
