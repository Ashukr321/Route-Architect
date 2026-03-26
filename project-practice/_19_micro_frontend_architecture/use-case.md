# 🎯 Project 19 — Micro-Frontend with Module Federation & Routing

## 📊 Difficulty: ⭐⭐⭐⭐⭐ Expert

---

## 📋 Situation / Use Case

You're building a **micro-frontend architecture** where multiple teams own different parts of the app. Each micro-frontend has its own routing, but they all integrate into a single shell application with seamless navigation.

**Client Requirement**: "We have 3 teams: Platform, Commerce, and Analytics. Each team deploys independently. The shell app handles shared layout and routing. Each micro-frontend registers its own routes. Navigation between micro-frontends should feel seamless."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| useRoutes (dynamic registration) | [`_10_useRoutes`](../../_10_useRoutes) |
| createBrowserRouter | [`_11_data_routers`](../../_11_data_routers) |
| Lazy Loading | [`_22_lazy_loading_routes`](../../_22_lazy_loading_routes) |
| Nested Layouts | [`_08_outlet_and_nested_routes`](../../_08_outlet_and_nested_routes) |
| useNavigate (cross-app) | [`_04_useNavigate`](../../_04_useNavigate) |
| useLocation (sync state) | [`_06_useLocation`](../../_06_useLocation) |
| Error Boundaries | [`_21_error_boundaries`](../../_21_error_boundaries) |
| Splat Routes (delegation) | [`_02_routes_and_route`](../../_02_routes_and_route) |

---

## 🛣️ Routing Approach — Shell + Remote Micro-Frontends

```jsx
// Shell Application — routes/index.js
// Each micro-frontend registers a splat route

const router = createBrowserRouter([
  {
    path: "/",
    element: <ShellLayout />,
    errorElement: <ShellError />,
    children: [
      { index: true, element: <Home /> },

      // Platform team owns auth & settings
      {
        path: "platform/*",
        lazy: async () => {
          const { PlatformApp } = await import("platformMFE/App");
          return { Component: PlatformApp };
        },
        errorElement: <MFEError module="Platform" />,
      },

      // Commerce team owns shop & checkout
      {
        path: "shop/*",
        lazy: async () => {
          const { CommerceApp } = await import("commerceMFE/App");
          return { Component: CommerceApp };
        },
        errorElement: <MFEError module="Commerce" />,
      },

      // Analytics team owns dashboards & reports
      {
        path: "analytics/*",
        lazy: async () => {
          const { AnalyticsApp } = await import("analyticsMFE/App");
          return { Component: AnalyticsApp };
        },
        errorElement: <MFEError module="Analytics" />,
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
```

```jsx
// Shell Layout — shared header/footer
function ShellLayout() {
  return (
    <div className="shell">
      <GlobalHeader />
      <div className="shell-content">
        <Outlet />
      </div>
      <GlobalFooter />
    </div>
  );
}
```

```jsx
// Commerce Micro-Frontend — has its own internal routing
// This runs inside the shell's Outlet at /shop/*

function CommerceApp() {
  return (
    <Routes>
      <Route index element={<ShopHome />} />
      <Route path="products" element={<ProductList />} />
      <Route path="products/:productId" element={<ProductDetail />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="orders" element={<OrderHistory />} />
      <Route path="orders/:orderId" element={<OrderDetail />} />
    </Routes>
  );
}

// Navigating between micro-frontends
function ShopHome() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Shop</h1>
      {/* Navigate within this MFE */}
      <Link to="products">Browse Products</Link>

      {/* Navigate to another MFE — absolute paths */}
      <button onClick={() => navigate("/analytics/sales")}>
        View Sales Analytics
      </button>
      <Link to="/platform/settings">Account Settings</Link>
    </div>
  );
}
```

```jsx
// MFE Error Boundary — graceful degradation
function MFEError({ module }) {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="mfe-error">
      <h2>⚠️ {module} module failed to load</h2>
      <p>This module is temporarily unavailable.</p>
      <button onClick={() => navigate("/")}>Go Home</button>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
}
```

---

## ✅ What You'll Learn

1. How to use **splat routes** (`/*`) to delegate routing to micro-frontends
2. How **lazy loading** enables independent deployment of MFEs
3. How to build a **shell application** that orchestrates multiple apps
4. How to navigate **between micro-frontends** using absolute paths
5. How to handle **MFE failures gracefully** with error boundaries
6. Production architecture for **large-scale team-based development**

---

## 🎯 Practice Tasks

- [ ] Implement shared state (user session) across all MFEs
- [ ] Add a global breadcrumb that works across MFE boundaries
- [ ] Handle version mismatches between shell and MFE
- [ ] Implement a feature flag system that controls MFE visibility
- [ ] Add cross-MFE event communication (e.g., cart update → header count)
