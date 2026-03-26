# 📌 08 - Outlet & Nested Routes

## 🔗 Official Docs
- [Nested Routes](https://reactrouter.com/start/library/routing#nested-routes)
- [Layout Routes](https://reactrouter.com/start/library/routing#layout-routes)

---

## 📖 What is Outlet?

`<Outlet />` is a component that **renders child routes** inside a parent route. Think of it as a **placeholder** where nested route content appears.

---

## 1️⃣ Basic Nested Routes with Outlet

### Route Configuration:
```jsx
<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<DashboardHome />} />
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>
```

### Parent Component (DashboardLayout):
```jsx
import { Outlet, NavLink } from "react-router";

function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <NavLink to="/dashboard" end>Home</NavLink>
        <NavLink to="/dashboard/profile">Profile</NavLink>
        <NavLink to="/dashboard/settings">Settings</NavLink>
      </aside>
      
      <main className="content">
        {/* Child route renders here! */}
        <Outlet />
      </main>
    </div>
  );
}
```

### How it works:
```
URL: /dashboard          → <DashboardLayout> renders <DashboardHome /> inside <Outlet />
URL: /dashboard/profile  → <DashboardLayout> renders <Profile /> inside <Outlet />
URL: /dashboard/settings → <DashboardLayout> renders <Settings /> inside <Outlet />
```

---

## 2️⃣ Layout Routes (No Path)

Routes **without a path** create layouts that don't add URL segments.

```jsx
<Routes>
  {/* Layout route — no path, just wraps children in a layout */}
  <Route element={<AuthLayout />}>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Route>

  <Route element={<AppLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
  </Route>
</Routes>
```

```jsx
function AuthLayout() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome</h1>
        <Outlet />  {/* Login or Register renders here */}
      </div>
    </div>
  );
}

function AppLayout() {
  return (
    <div className="app">
      <Header />
      <Sidebar />
      <main>
        <Outlet />  {/* Dashboard or Profile renders here */}
      </main>
      <Footer />
    </div>
  );
}
```

---

## 3️⃣ Deeply Nested Routes

```jsx
<Routes>
  <Route path="/" element={<RootLayout />}>
    <Route index element={<Home />} />
    <Route path="shop" element={<ShopLayout />}>
      <Route index element={<AllProducts />} />
      <Route path=":category" element={<CategoryLayout />}>
        <Route index element={<CategoryProducts />} />
        <Route path=":productId" element={<ProductDetail />} />
      </Route>
    </Route>
  </Route>
</Routes>
```

### Nesting visualization:
```
/                           → RootLayout > Home
/shop                       → RootLayout > ShopLayout > AllProducts
/shop/electronics           → RootLayout > ShopLayout > CategoryLayout > CategoryProducts
/shop/electronics/laptop-1  → RootLayout > ShopLayout > CategoryLayout > ProductDetail
```

---

## 4️⃣ Passing Context via Outlet

You can pass data from parent to child routes using `<Outlet context>`.

### Parent:
```jsx
import { Outlet } from "react-router";

function DashboardLayout() {
  const [user, setUser] = useState({ name: "John", role: "admin" });

  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet context={{ user, setUser }} />
    </div>
  );
}
```

### Child:
```jsx
import { useOutletContext } from "react-router";

function Profile() {
  const { user, setUser } = useOutletContext();
  
  return <h2>Hello, {user.name}!</h2>;
}
```

> 📌 More on this in `_17_useOutletContext`

---

## 5️⃣ Nested Routes vs Layout Routes

| Feature | Nested Routes | Layout Routes |
|---------|:------------:|:-------------:|
| Has `path` prop | ✅ | ❌ |
| Adds URL segments | ✅ | ❌ |
| Provides shared layout | ✅ | ✅ |
| Uses `<Outlet />` | ✅ | ✅ |

---

## 🧠 Key Points to Remember

1. `<Outlet />` is the **placeholder** for child route content in parent components
2. Every parent route that has children **must include `<Outlet />`** to render them
3. **Layout routes** (no path) wrap children in shared UI without adding URL segments
4. Nested routes create a **component hierarchy** — parent always renders around child
5. Use `context` prop on `<Outlet />` to **pass data** to child routes
6. **Index routes** are the default child that renders when the parent URL matches exactly
