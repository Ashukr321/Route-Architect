# 🎯 Project 24 — Amazon/Flipkart Marketplace (Full E-Commerce Platform)

## 📊 Difficulty: 🔥🔥🔥🔥🔥 Enterprise-Grade

---

## 📋 Situation / Use Case

You're building a **full-scale e-commerce marketplace** like Amazon/Flipkart with buyer accounts, seller dashboards, product management, orders, reviews, returns, and admin moderation. The platform has three distinct user portals — Buyer, Seller, and Admin — each with complex sub-routing.

**Client Requirement**: "Build a marketplace where:
- Buyers browse products with complex filters, add to cart, checkout with multiple addresses/payments
- Sellers manage their store, products, inventory, orders, and analytics
- Admins moderate sellers, products, reviews, and handle disputes
- Product URLs are SEO-friendly (`/product/:slug`)
- Checkout is a multi-step secured flow
- Seller onboarding is a gated process (approval required)
- Returns/refunds have their own workflow routes
- Every filter in search is URL-driven (shareable links)"

---

## 🧠 RBAC & Permission System

```jsx
export const MARKETPLACE_ROLES = {
  BUYER: "buyer",
  SELLER_PENDING: "seller_pending",    // Applied but not approved
  SELLER: "seller",                     // Approved seller
  SELLER_PREMIUM: "seller_premium",     // Premium seller features
  SUPPORT: "support",                   // Customer support agent
  MODERATOR: "moderator",              // Content moderation
  ADMIN: "admin",                       // Full platform control
};

export const SELLER_PERMISSIONS = {
  MANAGE_PRODUCTS: "manage_products",
  MANAGE_INVENTORY: "manage_inventory",
  VIEW_ORDERS: "view_orders",
  MANAGE_ORDERS: "manage_orders",
  VIEW_ANALYTICS: "view_analytics",        // Basic analytics
  VIEW_ADVANCED_ANALYTICS: "view_advanced_analytics", // Premium seller
  MANAGE_PROMOTIONS: "manage_promotions",   // Premium seller
  MANAGE_STORE_DESIGN: "manage_store_design",
  API_ACCESS: "api_access",                 // Premium seller
};

export const ADMIN_PERMISSIONS = {
  MANAGE_SELLERS: "manage_sellers",
  APPROVE_SELLERS: "approve_sellers",
  MANAGE_CATEGORIES: "manage_categories",
  MODERATE_REVIEWS: "moderate_reviews",
  MANAGE_DISPUTES: "manage_disputes",
  VIEW_PLATFORM_ANALYTICS: "view_platform_analytics",
  MANAGE_PROMOTIONS: "platform_promotions",
  MANAGE_BANNERS: "manage_banners",
  MANAGE_SUPPORT_TICKETS: "manage_support_tickets",
};

// Seller verification guard
function SellerApprovedGuard() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  
  if (user.role === "seller_pending") {
    return <Navigate to="/seller/onboarding/status" replace />;
  }
  
  if (!["seller", "seller_premium", "admin"].includes(user.role)) {
    return <Navigate to="/sell" replace />;
    // /sell = "Become a Seller" landing page
  }

  return <Outlet />;
}
```

---

## 🛣️ Routing Architecture

```jsx
const router = createBrowserRouter([
  // ========== BUYER-FACING (PUBLIC + AUTH) ==========
  {
    path: "/",
    lazy: () => import("./layouts/StorefrontLayout"),
    loader: storefrontLoader, // Categories, cart count, user
    children: [
      // --- Home ---
      { index: true, lazy: () => import("./pages/storefront/Home") },

      // --- Product Browsing ---
      {
        path: "search",
        lazy: () => import("./pages/storefront/SearchResults"),
        loader: searchLoader,
        // /search?q=laptop&category=electronics&brand=apple&brand=dell
        // &minPrice=50000&maxPrice=150000&rating=4&sort=price-low
        // &delivery=prime&discount=50&page=2
      },

      {
        path: "category/:categorySlug",
        lazy: () => import("./pages/storefront/CategoryPage"),
        loader: categoryLoader,
        children: [
          { index: true, lazy: () => import("./pages/storefront/CategoryProducts") },
          {
            path: ":subcategorySlug",
            lazy: () => import("./pages/storefront/SubcategoryProducts"),
            // /category/electronics/mobiles?brand=samsung&sort=popularity
          },
        ],
      },

      // --- Product Detail ---
      {
        path: "product/:productSlug",
        lazy: () => import("./pages/storefront/ProductDetail"),
        loader: productDetailLoader,
        // /product/apple-iphone-15-pro-128gb-natural-titanium
      },

      // --- Seller Store (public) ---
      {
        path: "store/:sellerSlug",
        lazy: () => import("./pages/storefront/SellerStore"),
        loader: sellerStoreLoader,
        children: [
          { index: true, lazy: () => import("./pages/storefront/StoreHome") },
          { path: "products", lazy: () => import("./pages/storefront/StoreProducts") },
          { path: "reviews", lazy: () => import("./pages/storefront/StoreReviews") },
          { path: "policies", lazy: () => import("./pages/storefront/StorePolicies") },
        ],
      },

      // --- Cart ---
      {
        path: "cart",
        lazy: () => import("./pages/checkout/Cart"),
        loader: cartLoader,
        action: cartAction, // Update qty, remove, apply coupon
      },

      // --- Checkout (Multi-Step, Auth Required) ---
      {
        path: "checkout",
        element: <AuthGuard />,
        children: [
          {
            lazy: () => import("./pages/checkout/CheckoutLayout"),
            loader: checkoutLoader,
            children: [
              { path: "address", lazy: () => import("./pages/checkout/SelectAddress") },
              { path: "address/new", lazy: () => import("./pages/checkout/AddAddress") },
              { path: "payment", lazy: () => import("./pages/checkout/SelectPayment") },
              { path: "review", lazy: () => import("./pages/checkout/OrderReview") },
              { path: "confirm", lazy: () => import("./pages/checkout/OrderConfirmation") },
            ],
          },
        ],
      },

      // --- Orders (Auth Required) ---
      {
        path: "orders",
        element: <AuthGuard />,
        children: [
          {
            lazy: () => import("./pages/buyer/OrdersLayout"),
            children: [
              { index: true, lazy: () => import("./pages/buyer/OrderList") },
              {
                path: ":orderId",
                lazy: () => import("./pages/buyer/OrderDetail"),
                children: [
                  { index: true, lazy: () => import("./pages/buyer/OrderTracking") },
                  { path: "invoice", lazy: () => import("./pages/buyer/Invoice") },
                  {
                    path: "return/:itemId",
                    lazy: () => import("./pages/buyer/ReturnRequest"),
                    children: [
                      { path: "reason", lazy: () => import("./pages/buyer/ReturnReason") },
                      { path: "method", lazy: () => import("./pages/buyer/ReturnMethod") },
                      { path: "confirm", lazy: () => import("./pages/buyer/ReturnConfirm") },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // --- Wishlist, Addresses, Payment Methods (Auth) ---
      { path: "wishlist", element: <AuthGuard />, children: [{ index: true, lazy: () => import("./pages/buyer/Wishlist") }] },
      { path: "addresses", element: <AuthGuard />, children: [{ index: true, lazy: () => import("./pages/buyer/Addresses") }] },

      // --- Reviews (Auth) ---
      { path: "review/write/:orderId/:productId", element: <AuthGuard />, children: [{ index: true, lazy: () => import("./pages/buyer/WriteReview") }] },

      // --- Deals & Offers ---
      { path: "deals", lazy: () => import("./pages/storefront/Deals") },
      { path: "deals/:dealSlug", lazy: () => import("./pages/storefront/DealDetail") },

      // --- Become a Seller ---
      { path: "sell", lazy: () => import("./pages/seller/BecomeASeller") },
    ],
  },

  // ========== SELLER PORTAL ==========
  {
    path: "/seller",
    children: [
      // Seller Onboarding (before approval)
      {
        path: "onboarding",
        element: <AuthGuard />,
        children: [
          {
            lazy: () => import("./pages/seller/onboarding/OnboardingLayout"),
            children: [
              { path: "business-info", lazy: () => import("./pages/seller/onboarding/BusinessInfo") },
              { path: "documents", lazy: () => import("./pages/seller/onboarding/Documents") },
              { path: "bank", lazy: () => import("./pages/seller/onboarding/BankDetails") },
              { path: "verification", lazy: () => import("./pages/seller/onboarding/Verification") },
              { path: "status", lazy: () => import("./pages/seller/onboarding/ApprovalStatus") },
            ],
          },
        ],
      },

      // Seller Dashboard (approved sellers only)
      {
        path: "dashboard",
        element: <SellerApprovedGuard />,
        children: [
          {
            lazy: () => import("./pages/seller/dashboard/SellerLayout"),
            loader: sellerDashLoader,
            children: [
              { index: true, lazy: () => import("./pages/seller/dashboard/Overview") },

              // Products
              {
                path: "products",
                children: [
                  { index: true, lazy: () => import("./pages/seller/dashboard/ProductList") },
                  { path: "new", lazy: () => import("./pages/seller/dashboard/AddProduct") },
                  { path: ":productId/edit", lazy: () => import("./pages/seller/dashboard/EditProduct") },
                ],
              },

              // Inventory
              { path: "inventory", lazy: () => import("./pages/seller/dashboard/Inventory") },

              // Orders
              {
                path: "orders",
                children: [
                  { index: true, lazy: () => import("./pages/seller/dashboard/SellerOrders") },
                  { path: ":orderId", lazy: () => import("./pages/seller/dashboard/SellerOrderDetail") },
                  { path: ":orderId/ship", lazy: () => import("./pages/seller/dashboard/ShipOrder") },
                ],
              },

              // Returns
              { path: "returns", lazy: () => import("./pages/seller/dashboard/Returns") },
              { path: "returns/:returnId", lazy: () => import("./pages/seller/dashboard/ReturnDetail") },

              // Analytics (Basic for regular, Advanced for premium)
              {
                path: "analytics",
                children: [
                  { index: true, lazy: () => import("./pages/seller/dashboard/BasicAnalytics") },
                  {
                    path: "advanced",
                    element: <PermissionGuard requiredPermissions={["view_advanced_analytics"]} />,
                    children: [
                      { index: true, lazy: () => import("./pages/seller/dashboard/AdvancedAnalytics") },
                    ],
                  },
                ],
              },

              // Promotions (Premium seller only)
              {
                path: "promotions",
                element: <PermissionGuard requiredPermissions={["manage_promotions"]} />,
                children: [
                  { index: true, lazy: () => import("./pages/seller/dashboard/Promotions") },
                  { path: "new", lazy: () => import("./pages/seller/dashboard/CreatePromotion") },
                ],
              },

              // Store Settings
              { path: "store-settings", lazy: () => import("./pages/seller/dashboard/StoreSettings") },
              { path: "payments", lazy: () => import("./pages/seller/dashboard/PaymentSettings") },
              { path: "support", lazy: () => import("./pages/seller/dashboard/SellerSupport") },
            ],
          },
        ],
      },
    ],
  },

  // ========== ADMIN PORTAL ==========
  {
    path: "/admin",
    element: <PermissionGuard requiredPermissions={["manage_sellers"]} />,
    children: [
      {
        lazy: () => import("./pages/admin/AdminLayout"),
        children: [
          { path: "dashboard", lazy: () => import("./pages/admin/Dashboard") },
          { path: "sellers", lazy: () => import("./pages/admin/SellerManagement") },
          { path: "sellers/:sellerId", lazy: () => import("./pages/admin/SellerDetail") },
          { path: "sellers/pending", lazy: () => import("./pages/admin/PendingSellers") },
          { path: "products", lazy: () => import("./pages/admin/ProductModeration") },
          { path: "categories", lazy: () => import("./pages/admin/CategoryManagement") },
          { path: "reviews", lazy: () => import("./pages/admin/ReviewModeration") },
          { path: "disputes", lazy: () => import("./pages/admin/Disputes") },
          { path: "disputes/:disputeId", lazy: () => import("./pages/admin/DisputeDetail") },
          { path: "banners", lazy: () => import("./pages/admin/BannerManagement") },
          { path: "coupons", lazy: () => import("./pages/admin/CouponManagement") },
          { path: "analytics", lazy: () => import("./pages/admin/PlatformAnalytics") },
          { path: "support-tickets", lazy: () => import("./pages/admin/SupportTickets") },
        ],
      },
    ],
  },

  // Auth
  { path: "/login", lazy: () => import("./pages/auth/Login") },
  { path: "/signup", lazy: () => import("./pages/auth/Signup") },
]);
```

---

## 🔑 Key Routing Patterns from Amazon/Flipkart

### 1. Complex Search Filters (10+ URL Params)
```jsx
// /search?q=laptop&category=electronics&brand=apple&brand=dell&brand=hp
// &minPrice=50000&maxPrice=150000&rating=4&sort=price-low
// &delivery=prime&discount=50&availability=instock&page=2

async function searchLoader({ request }) {
  const url = new URL(request.url);
  return api.search({
    query: url.searchParams.get("q"),
    category: url.searchParams.get("category"),
    brands: url.searchParams.getAll("brand"),       // Multiple brands
    minPrice: url.searchParams.get("minPrice"),
    maxPrice: url.searchParams.get("maxPrice"),
    minRating: url.searchParams.get("rating"),
    sort: url.searchParams.get("sort") || "relevance",
    delivery: url.searchParams.get("delivery"),
    discount: url.searchParams.get("discount"),
    availability: url.searchParams.get("availability"),
    page: Number(url.searchParams.get("page")) || 1,
  });
}
```

### 2. Multi-Step Return Flow
```jsx
// Return is a sub-workflow inside an order:
// /orders/ORD123/return/ITEM456/reason → /method → /confirm
// Each step validates the previous was completed
```

### 3. Seller Onboarding Gate
```jsx
// New sellers must complete onboarding before accessing dashboard
// seller_pending → /seller/onboarding/status (waiting for approval)
// seller → /seller/dashboard (full access)
```

---

## ✅ What You'll Learn

1. **Three-portal architecture** — Buyer, Seller, Admin with separate routing trees
2. **Seller approval workflow** — Pending state blocks dashboard access
3. **Premium seller gating** — Advanced analytics, promotions only for premium
4. **Complex search with 10+ URL parameters** — Brands, price, rating, filters
5. **Multi-step checkout** secured behind auth
6. **Return/refund workflow** as nested sub-routes inside an order
7. **Dispute resolution routes** for admin moderation
8. **SEO-friendly product slugs** — `/product/apple-iphone-15-pro-128gb`

---

## 🎯 Practice Tasks

- [ ] Add "Buy Again" that re-adds items to cart and navigates to `/cart`
- [ ] Implement real-time order tracking with status polling
- [ ] Build the seller approval workflow (admin side)
- [ ] Add product comparison page (`/compare?p=slug1&p=slug2&p=slug3`)
- [ ] Implement flash sale countdown routes with time-gated access
- [ ] Build the dispute resolution flow (buyer → admin → seller)
