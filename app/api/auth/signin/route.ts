import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { verifyPassword, createToken } from '@/lib/auth-utils';
import { authRateLimit } from '@/lib/rate-limit';
import { emailSchema, passwordSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  // Rate limiting - 5 attempts per 15 minutes
  const rateLimitResult = await authRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    }) as any;

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await createToken(user.id, user.email!, user.role);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // If rememberMe is true, set cookie for 7 days, otherwise 24 hours
    const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24;

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Authentication failed. Please try again.' },
      { status: 500 }
    );
  }
}
