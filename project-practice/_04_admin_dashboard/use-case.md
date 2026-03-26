# 🎯 Project 04 — Admin Dashboard with Nested Layouts

## 📊 Difficulty: ⭐⭐ Intermediate

---

## 📋 Situation / Use Case

You're building an **admin dashboard** with a sidebar navigation, nested pages (Overview, Analytics, Users, Settings), and a layout where the sidebar persists across all dashboard pages.

**Client Requirement**: "The dashboard should have a fixed sidebar and header. When the admin clicks different sections, only the main content area should change — the sidebar and header should stay."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| Nested Routes | [`_08_outlet_and_nested_routes`](../../_08_outlet_and_nested_routes) |
| Outlet | [`_08_outlet_and_nested_routes`](../../_08_outlet_and_nested_routes) |
| Layout Routes | [`_08_outlet_and_nested_routes`](../../_08_outlet_and_nested_routes) |
| NavLink (active sidebar) | [`_03_link_and_navlink`](../../_03_link_and_navlink) |
| Index Routes | [`_02_routes_and_route`](../../_02_routes_and_route) |
| useLocation | [`_06_useLocation`](../../_06_useLocation) |

---

## 🏗️ Project Setup

```bash
npm create vite@latest admin-dashboard -- --template react
cd admin-dashboard
npm install react-router
npm run dev
```

---

## 📁 Folder Structure

```
src/
├── App.jsx
├── layouts/
│   ├── DashboardLayout.jsx    # Sidebar + Header + Outlet
│   └── AuthLayout.jsx         # Centered card layout
├── pages/
│   ├── dashboard/
│   │   ├── Overview.jsx
│   │   ├── Analytics.jsx
│   │   ├── Users.jsx
│   │   └── Settings.jsx
│   ├── Login.jsx
│   └── NotFound.jsx
├── components/
│   ├── Sidebar.jsx
│   ├── Header.jsx
│   └── Breadcrumb.jsx
```

---

## 🛣️ Routing Approach

```jsx
// App.jsx
import { Routes, Route } from "react-router";

function App() {
  return (
    <Routes>
      {/* Auth Layout — no sidebar */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Dashboard Layout — sidebar + header */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:userId" element={<UserDetail />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

```jsx
// layouts/DashboardLayout.jsx
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-area">
        <Header />
        <main className="content">
          <Outlet />  {/* Child routes render here */}
        </main>
      </div>
    </div>
  );
}
```

```jsx
// components/Sidebar.jsx
import { NavLink } from "react-router";

function Sidebar() {
  const links = [
    { to: "/dashboard", label: "📊 Overview", end: true },
    { to: "/dashboard/analytics", label: "📈 Analytics" },
    { to: "/dashboard/users", label: "👥 Users" },
    { to: "/dashboard/settings", label: "⚙️ Settings" },
  ];

  return (
    <aside className="sidebar">
      <h2>Admin Panel</h2>
      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
```

```jsx
// layouts/AuthLayout.jsx
import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h1>Welcome</h1>
        <Outlet />  {/* Login or Register renders here */}
      </div>
    </div>
  );
}
```

```jsx
// components/Breadcrumb.jsx
import { useLocation, Link } from "react-router";

function Breadcrumb() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="breadcrumb">
      {parts.map((part, index) => {
        const path = "/" + parts.slice(0, index + 1).join("/");
        const isLast = index === parts.length - 1;
        return (
          <span key={path}>
            {isLast ? (
              <span className="current">{part}</span>
            ) : (
              <Link to={path}>{part}</Link>
            )}
            {!isLast && " / "}
          </span>
        );
      })}
    </nav>
  );
}
```

---

## ✅ What You'll Learn

1. How to create **persistent layouts** with `<Outlet />`
2. How to use **Layout Routes** (no path) for grouping routes with shared UI
3. How to build **multiple layout patterns** (Auth vs Dashboard)
4. How **Index Routes** work as default child content
5. How to build **dynamic breadcrumbs** with `useLocation`
6. How `NavLink` `end` prop prevents parent from always being active

---

## 🎯 Practice Tasks

- [ ] Add a collapsible sidebar (toggle open/close)
- [ ] Show current page title in the header using `useLocation`
- [ ] Add a nested settings page: Settings > Profile, Settings > Security
- [ ] Highlight the parent NavLink when on a child route (without `end`)
