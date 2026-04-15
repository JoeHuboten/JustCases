-- ============================================================
-- JustCases — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ─── Enums ───────────────────────────────────────────────────
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "PaymentType" AS ENUM ('CARD', 'PAYPAL', 'BANK_TRANSFER', 'CASH_ON_DELIVERY');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
CREATE TYPE "VerificationTokenType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');
CREATE TYPE "CheckoutSessionStatus" AS ENUM ('PENDING', 'COMPLETED', 'EXPIRED');

-- ─── updatedAt trigger helper ─────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── Tables ──────────────────────────────────────────────────

CREATE TABLE "User" (
  "id"            TEXT        NOT NULL,
  "name"          TEXT,
  "email"         TEXT,
  "emailVerified" TIMESTAMP(3),
  "image"         TEXT,
  "password"      TEXT,
  "phone"         TEXT,
  "dateOfBirth"   TIMESTAMP(3),
  "role"          "UserRole"  NOT NULL DEFAULT 'USER',
  "tokenVersion"  INTEGER     NOT NULL DEFAULT 0,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TRIGGER trg_user_updated_at BEFORE UPDATE ON "User"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;

CREATE TABLE "Account" (
  "id"                TEXT NOT NULL,
  "userId"            TEXT NOT NULL,
  "type"              TEXT NOT NULL,
  "provider"          TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token"     TEXT,
  "access_token"      TEXT,
  "expires_at"        INTEGER,
  "token_type"        TEXT,
  "scope"             TEXT,
  "id_token"          TEXT,
  "session_state"     TEXT,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
ALTER TABLE "Account" DISABLE ROW LEVEL SECURITY;

CREATE TABLE "Session" (
  "id"           TEXT        NOT NULL,
  "sessionToken" TEXT        NOT NULL,
  "userId"       TEXT        NOT NULL,
  "expires"      TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
ALTER TABLE "Session" DISABLE ROW LEVEL SECURITY;

CREATE TABLE "VerificationToken" (
  "identifier" TEXT                    NOT NULL,
  "token"      TEXT                    NOT NULL,
  "expires"    TIMESTAMP(3)            NOT NULL,
  "type"       "VerificationTokenType" NOT NULL DEFAULT 'EMAIL_VERIFICATION'
);
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE INDEX "VerificationToken_identifier_type_idx" ON "VerificationToken"("identifier", "type");
CREATE INDEX "VerificationToken_expires_idx" ON "VerificationToken"("expires");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
ALTER TABLE "VerificationToken" DISABLE ROW LEVEL SECURITY;

CREATE TABLE "Category" (
  "id"          TEXT         NOT NULL,
  "name"        TEXT         NOT NULL,
  "slug"        TEXT         NOT NULL,
  "description" TEXT,
  "image"       TEXT,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE TRIGGER trg_category_updated_at BEFORE UPDATE ON "Category"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE "Category" DISABLE ROW LEVEL SECURITY;

CREATE TABLE "Product" (
  "id"               TEXT             NOT NULL,
  "name"             TEXT             NOT NULL,
  "slug"             TEXT             NOT NULL,
  "description"      TEXT,
  "price"            DOUBLE PRECISION NOT NULL,
  "oldPrice"         DOUBLE PRECISION,
  "discount"         INTEGER,
  "image"            TEXT             NOT NULL,
  "images"           TEXT             NOT NULL,
  "categoryId"       TEXT             NOT NULL,
  "colors"           TEXT             NOT NULL,
  "sizes"            TEXT             NOT NULL,
  "rating"           DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reviews"          INTEGER          NOT NULL DEFAULT 0,
  "inStock"          BOOLEAN          NOT NULL DEFAULT true,
  "stock"            INTEGER          NOT NULL DEFAULT 0,
  "lowStockThreshold" INTEGER         NOT NULL DEFAULT 5,
  "featured"         BOOLEAN          NOT NULL DEFAULT false,
  "specifications"   JSONB,
  "createdAt"        TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"        TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Product_featured_idx" ON "Product"("featured");
CREATE INDEX "Product_inStock_idx" ON "Product"("inStock");
CREATE INDEX "Product_price_idx" ON "Product"("price");
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");
CREATE TRIGGER trg_product_updated_at BEFORE UPDATE ON "Product"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE "Product" DISABLE ROW LEVEL SECURITY;

CREATE TABLE "DiscountCode" (
  "id"          TEXT         NOT NULL,
  "code"        TEXT         NOT NULL,
  "percentage"  INTEGER      NOT NULL,
  "active"      BOOLEAN      NOT NULL DEFAULT true,
  "expiresAt"   TIMESTAMP(3),
  "maxUses"     INTEGER,
  "currentUses" INTEGER      NOT NULL DEFAULT 0,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DiscountCode_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "DiscountCode_code_key" ON "DiscountCode"("code");
CREATE TRIGGER trg_discountcode_updated_at BEFORE UPDATE ON "DiscountCode"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE "DiscountCode" DISABLE ROW LEVEL SECURITY;

CREATE TABLE "Address" (
  "id"         TEXT         NOT NULL,
  "userId"     TEXT         NOT NULL,
  "firstName"  TEXT         NOT NULL,
  "lastName"   TEXT         NOT NULL,
  "address1"   TEXT         NOT NULL,
  "address2"   TEXT,
  "city"       TEXT         NOT NULL,
  "state"      TEXT         NOT NULL,
  "postalCode" TEXT         NOT NULL,
  "country"    TEXT         NOT NULL,
  "phone"      TEXT,
  "isDefault"  BOOLEAN      NOT NULL DEFAULT false,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);
CREATE TRIGGER trg_address_updated_at BEFORE UPDATE ON "Address"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE "Address" DISABLE ROW LEVEL SECURITY;

CREATE TABLE "PaymentMethod" (
  "id"          TEXT          NOT NULL,
  "userId"      TEXT          NOT NULL,
  "type"        "PaymentType" NOT NULL,
  "cardNumber"  TEXT,
  "cardBrand"   TEXT,
  "expiryMonth" INTEGER,
  "expiryYear"  INTEGER,
  "holderName"  TEXT,
  "isDefault"   BOOLEAN       NOT NULL DEFAULT false,
  "createdAt"   TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);
CREATE TRIGGER trg_paymentmethod_updated_at BEFORE UPDATE ON "PaymentMethod"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE "PaymentMethod" DISABLE ROW LEVEL SECURITY;

CREATE TABLE "CheckoutSession" (
  "id"                TEXT                    NOT NULL,
  "userId"            TEXT                    NOT NULL,
  "status"            "CheckoutSessionStatus" NOT NULL DEFAULT 'PENDING',
  "currency"          TEXT                    NOT NULL DEFAULT 'EUR',
  "subtotal"          DOUBLE PRECISION        NOT NULL,
  "discount"          DOUBLE PRECISION        NOT NULL DEFAULT 0,
  "total"             DOUBLE PRECISION        NOT NULL,
  "discountCodeId"    TEXT,
  "shippingAddress"   JSONB,
  "items"             JSONB                   NOT NULL,
  "provider"          "PaymentType",
  "providerPaymentId" TEXT,
  "finalizedAt"       TIMESTAMP(3),
  "expiresAt"         TIMESTAMP(3)            NOT NULL,
  "createdAt"         TIMESTAMP(3)            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"         TIMESTAMP(3)            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CheckoutSession_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CheckoutSession_userId_status_idx" ON "CheckoutSession"("userId", "status");
CREATE INDEX "CheckoutSession_expiresAt_idx" ON "CheckoutSession"("expiresAt");
CREATE INDEX "CheckoutSession_providerPaymentId_idx" ON "CheckoutSession"("providerPaymentId");
CREATE TRIGGER trg_checkoutsession_updated_at BEFORE UPDATE ON "CheckoutSession"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE "CheckoutSession" DISABLE ROW LEVEL SECURITY;

CREATE TABLE "Order" (
  "id"                TEXT             NOT NULL,
  "userId"            TEXT             NOT NULL,
  "total"             DOUBLE PRECISION NOT NULL,
  "subtotal"          DOUBLE PRECISION NOT NULL,
  "discount"          DOUBLE PRECISION NOT NULL DEFAULT 0,
  "deliveryFee"       DOUBLE PRECISION NOT NULL DEFAULT 0,
  "status"            "OrderStatus"    NOT NULL DEFAULT 'PENDING',
  "paymentType"       "PaymentType"    NOT NULL DEFAULT 'CARD',
  "paymentIntentId"   TEXT,
  "paymentId"         TEXT,
  "discountCodeId"    TEXT,
  "shippingAddressId" TEXT,
  "paymentMethodId"   TEXT,
  "checkoutSessionId" TEXT,
  "trackingNumber"    TEXT,
  "courierService"    TEXT,
  "estimatedDelivery" TIMESTAMP(3),
  "actualDelivery"    TIMESTAMP(3),
  "notes"             TEXT,
  "customerNotes"     TEXT,
  "adminNotes"        TEXT,
  "cancelReason"      TEXT,
  "cancelledAt"       TIMESTAMP(3),
  "createdAt"         TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"         TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Order_paymentIntentId_key" ON "Order"("paymentIntentId");
CREATE UNIQUE INDEX "Order_paymentId_key" ON "Order"("paymentId");
CREATE UNIQUE INDEX "Order_checkoutSessionId_key" ON "Order"("checkoutSessionId");
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_trackingNumber_idx" ON "Order"("trackingNumber");
CREATE TRIGGER trg_order_updated_at BEFORE UPDATE ON "Order"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE "Order" DISABLE ROW LEVEL SECURITY;

CREATE TABLE "OrderStatusHistory" (
  "id"        TEXT         NOT NULL,
  "orderId"   TEXT         NOT NULL,
  "status"    "OrderStatus" NOT NULL,
  "notes"     TEXT,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "OrderStatusHistory_orderId_idx" ON "OrderStatusHistory"("orderId");
CREATE INDEX "OrderStatusHistory_createdAt_idx" ON "OrderStatusHistory"("createdAt");
ALTER TABLE "OrderStatusHistory" DISABLE ROW LEVEL SECURITY;

CREATE TABLE "OrderItem" (
  "id"        TEXT             NOT NULL,
  "orderId"   TEXT             NOT NULL,
  "productId" TEXT             NOT NULL,
  "quantity"  INTEGER          NOT NULL,
  "price"     DOUBLE PRECISION NOT NULL,
  "color"     TEXT,
  "size"      TEXT,
  CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "OrderItem" DISABLE ROW LEVEL SECURITY;

CREATE TABLE "CartItem" (
  "id"        TEXT         NOT NULL,
  "userId"    TEXT         NOT NULL,
  "productId" TEXT         NOT NULL,
  "quantity"  INTEGER      NOT NULL,
  "color"     TEXT,
  "size"      TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CartItem_userId_productId_idx" ON "CartItem"("userId", "productId");
CREATE TRIGGER trg_cartitem_updated_at BEFORE UPDATE ON "CartItem"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE "CartItem" DISABLE ROW LEVEL SECURITY;

CREATE TABLE "WishlistItem" (
  "id"        TEXT         NOT NULL,
  "userId"    TEXT         NOT NULL,
  "productId" TEXT         NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WishlistItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "WishlistItem_userId_idx" ON "WishlistItem"("userId");
CREATE UNIQUE INDEX "WishlistItem_userId_productId_key" ON "WishlistItem"("userId", "productId");
ALTER TABLE "WishlistItem" DISABLE ROW LEVEL SECURITY;

CREATE TABLE "Review" (
  "id"        TEXT         NOT NULL,
  "userId"    TEXT         NOT NULL,
  "productId" TEXT         NOT NULL,
  "rating"    INTEGER      NOT NULL,
  "title"     TEXT,
  "comment"   TEXT,
  "verified"  BOOLEAN      NOT NULL DEFAULT false,
  "helpful"   INTEGER      NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Review_productId_idx" ON "Review"("productId");
CREATE INDEX "Review_rating_idx" ON "Review"("rating");
CREATE UNIQUE INDEX "Review_userId_productId_key" ON "Review"("userId", "productId");
CREATE TRIGGER trg_review_updated_at BEFORE UPDATE ON "Review"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE "Review" DISABLE ROW LEVEL SECURITY;

CREATE TABLE "ContactMessage" (
  "id"        TEXT         NOT NULL,
  "name"      TEXT         NOT NULL,
  "email"     TEXT         NOT NULL,
  "subject"   TEXT         NOT NULL,
  "message"   TEXT         NOT NULL,
  "read"      BOOLEAN      NOT NULL DEFAULT false,
  "replied"   BOOLEAN      NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");
CREATE INDEX "ContactMessage_read_idx" ON "ContactMessage"("read");
CREATE TRIGGER trg_contactmessage_updated_at BEFORE UPDATE ON "ContactMessage"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE "ContactMessage" DISABLE ROW LEVEL SECURITY;

CREATE TABLE "NewsletterSubscription" (
  "id"           TEXT         NOT NULL,
  "email"        TEXT         NOT NULL,
  "active"       BOOLEAN      NOT NULL DEFAULT true,
  "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "NewsletterSubscription_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "NewsletterSubscription_email_key" ON "NewsletterSubscription"("email");
CREATE INDEX "NewsletterSubscription_email_idx" ON "NewsletterSubscription"("email");
CREATE INDEX "NewsletterSubscription_active_idx" ON "NewsletterSubscription"("active");
CREATE TRIGGER trg_newsletter_updated_at BEFORE UPDATE ON "NewsletterSubscription"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE "NewsletterSubscription" DISABLE ROW LEVEL SECURITY;

-- ─── Foreign Keys ─────────────────────────────────────────────

ALTER TABLE "Account"
  ADD CONSTRAINT "Account_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Session"
  ADD CONSTRAINT "Session_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Product"
  ADD CONSTRAINT "Product_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Address"
  ADD CONSTRAINT "Address_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PaymentMethod"
  ADD CONSTRAINT "PaymentMethod_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CheckoutSession"
  ADD CONSTRAINT "CheckoutSession_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CheckoutSession"
  ADD CONSTRAINT "CheckoutSession_discountCodeId_fkey"
  FOREIGN KEY ("discountCodeId") REFERENCES "DiscountCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Order"
  ADD CONSTRAINT "Order_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Order"
  ADD CONSTRAINT "Order_shippingAddressId_fkey"
  FOREIGN KEY ("shippingAddressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Order"
  ADD CONSTRAINT "Order_paymentMethodId_fkey"
  FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Order"
  ADD CONSTRAINT "Order_discountCodeId_fkey"
  FOREIGN KEY ("discountCodeId") REFERENCES "DiscountCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Order"
  ADD CONSTRAINT "Order_checkoutSessionId_fkey"
  FOREIGN KEY ("checkoutSessionId") REFERENCES "CheckoutSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "OrderStatusHistory"
  ADD CONSTRAINT "OrderStatusHistory_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OrderItem"
  ADD CONSTRAINT "OrderItem_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OrderItem"
  ADD CONSTRAINT "OrderItem_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CartItem"
  ADD CONSTRAINT "CartItem_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CartItem"
  ADD CONSTRAINT "CartItem_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WishlistItem"
  ADD CONSTRAINT "WishlistItem_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WishlistItem"
  ADD CONSTRAINT "WishlistItem_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Review"
  ADD CONSTRAINT "Review_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Review"
  ADD CONSTRAINT "Review_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
