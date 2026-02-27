# PayPal Integration Guide

## ✅ Stripe Removed, PayPal Added!

Your JustCases e-commerce site now uses **PayPal** for payment processing instead of Stripe.

## Quick Setup (5 Minutes)

### Step 1: Create PayPal Developer Account
1. Go to https://developer.paypal.com
2. Log in with your PayPal account (or create one)
3. This is FREE and gives you sandbox testing credentials

### Step 2: Get Your API Credentials
1. Go to https://developer.paypal.com/dashboard/applications/live
2. Click "Create App"
3. Give it a name (e.g., "JustCases")
4. Copy your **Client ID** (starts with `A...`)
5. Click "Show" under "Secret" and copy your **Client Secret**

### Step 3: Update .env.local
Open `.env.local` and replace:

```bash
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
```

With your actual credentials:

```bash
NEXT_PUBLIC_PAYPAL_CLIENT_ID="AZaXFn...your_actual_client_id"
PAYPAL_CLIENT_SECRET="EJ...your_actual_secret"
PAYPAL_MODE="sandbox"  # Keep as sandbox for testing
```

### Step 4: Restart Server
```powershell
# Stop current server (Ctrl+C)
npm run dev
```

## 🎯 What Changed?

### Removed
- ❌ Stripe packages (`@stripe/stripe-js`, `stripe`)
- ❌ Stripe API routes (`/api/payment/create-intent`)
- ❌ Stripe Elements checkout form

### Added
- ✅ PayPal SDK (`@paypal/react-paypal-js`)
- ✅ PayPal Create Order API (`/api/payment/paypal/create-order`)
- ✅ PayPal Capture Order API (`/api/payment/paypal/capture-order`)
- ✅ PayPal Buttons integration on checkout page
- ✅ PAYPAL payment type added to database enum

### Database Changes
- Updated `PaymentType` enum to include `PAYPAL`
- Schema pushed to PostgreSQL successfully

## 🧪 Testing

### Sandbox Test Accounts (Free)
Once you have sandbox credentials:

1. Visit https://developer.paypal.com/dashboard/accounts
2. You'll see test buyer and seller accounts
3. Use these to test payments (no real money!)

**Test Buyer Account:**
- Email: Usually ends with `@personal.example.com`
- Password: Shown in dashboard
- Use this to "pay" during checkout

**Test Seller Account:**
- Your business account (receives payments)
- Check dashboard to see test transactions

### Testing Flow
1. Add products to cart
2. Go to checkout
3. Click PayPal button
4. Log in with sandbox buyer account
5. Complete payment
6. You'll be redirected to success page
7. Order saved to database with `PAYPAL` payment type

## 📦 Order Flow

1. Customer clicks "Checkout"
2. PayPal Create Order API called → Returns Order ID
3. Customer sees PayPal button
4. Customer clicks PayPal → PayPal popup opens
5. Customer logs in and confirms payment
6. PayPal Capture API called → Order completed
7. Order saved to database
8. Status history created: "Order placed via PayPal"
9. Discount code usage incremented (if used)
10. Cart cleared
11. Redirect to success page

## 💰 Payment Types Supported

Your database now supports:
- `CARD` - Credit/debit cards (legacy)
- `PAYPAL` - PayPal payments ✨ NEW
- `BANK_TRANSFER` - Bank transfers
- `CASH_ON_DELIVERY` - Pay on delivery

## 🔐 Security

### What's Secure
✅ Client Secret never exposed to frontend
✅ PayPal handles all sensitive data
✅ OAuth2 authentication for API calls
✅ Payment capture server-side only
✅ Order verification before database save

### Production Checklist
Before going live:
- [ ] Switch `PAYPAL_MODE` to `"live"`
- [ ] Get live credentials from https://developer.paypal.com/dashboard/applications/live
- [ ] Update `NEXT_PUBLIC_APP_URL` to your domain
- [ ] Test with small real transaction
- [ ] Set up webhook for payment notifications

## 🌍 Currency & Localization

Currently set to USD. To change:

1. Update `currency` in checkout page:
```typescript
<PayPalScriptProvider options={{ 
  clientId: PAYPAL_CLIENT_ID,
  currency: 'BGN',  // Change to Bulgarian Lev
}}>
```

2. Update API routes to use BGN in amount calculations

Supported currencies: USD, EUR, GBP, BGN, and 25+ others

## 🔧 Troubleshooting

### "PayPal Not Configured" Error
- Check `.env.local` has correct credentials
- Restart dev server after changing .env
- Client ID should start with "A"
- Make sure no extra quotes or spaces

### PayPal Button Not Showing
- Check browser console for errors
- Verify PayPal SDK loaded (check Network tab)
- Ensure client ID is correct

### "Payment Capture Failed"
- Check sandbox account has funds
- Verify order wasn't already captured
- Check terminal logs for detailed error

### Orders Not Saving
- Check database connection
- Verify Prisma schema includes PAYPAL enum
- Check terminal for SQL errors

## 📊 Admin Features

Orders paid via PayPal will show:
- Payment Type: `PAYPAL`
- Payment ID: PayPal transaction ID
- Full order tracking (same as other payment types)

## 🚀 Next Steps

### Recommended Enhancements
1. **Webhooks** - Listen for PayPal events (refunds, disputes)
2. **Subscriptions** - Add recurring payment support
3. **Multi-currency** - Let customers choose currency
4. **Express Checkout** - Save shipping info in PayPal
5. **Refunds** - Add refund functionality to admin panel

### Files Modified
- `app/checkout/page.tsx` - New PayPal checkout
- `app/api/payment/paypal/create-order/route.ts` - Create order endpoint
- `app/api/payment/paypal/capture-order/route.ts` - Capture payment endpoint
- `prisma/schema.prisma` - Added PAYPAL to PaymentType enum
- `.env.local` - Updated with PayPal credentials
- `package.json` - Swapped Stripe for PayPal packages

### Files Deleted
- `app/api/payment/create-intent/route.ts` - Old Stripe endpoint

## 💡 Why PayPal?

### Advantages over Stripe
✅ More trusted by Bulgarian customers
✅ Simpler integration (no card handling)
✅ Built-in buyer protection
✅ Mobile app integration
✅ Faster checkout (saved accounts)
✅ No PCI compliance needed

### Considerations
⚠️ Higher fees than Stripe (~3.5% vs 2.9%)
⚠️ Funds held for new accounts
⚠️ Customer needs PayPal account (or can pay as guest)

## 📞 Support

- PayPal Developer Docs: https://developer.paypal.com/docs/
- Integration Guide: https://developer.paypal.com/docs/checkout/
- Community: https://www.paypal-community.com/

---

**Status**: ✅ Fully Implemented
**Testing**: Ready for sandbox testing
**Production**: Needs live credentials
**Last Updated**: January 2025
