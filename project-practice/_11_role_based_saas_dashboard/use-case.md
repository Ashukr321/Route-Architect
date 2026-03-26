# 🎯 Project 11 — Role-Based SaaS Dashboard

## 📊 Difficulty: ⭐⭐⭐ Advanced

---

## 📋 Situation / Use Case

You're building a **SaaS platform** with role-based access. Admins see the full dashboard, Managers see limited options, and regular Users see only their own data. The routing dynamically adjusts based on the user's role.

**Client Requirement**: "Admins should access everything. Managers can see reports but not billing. Regular users only see their profile and projects. If someone tries to access a page they're not authorized for, show a 403 page — not a 404."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| Protected Routes (role-based) | [`_20_protected_routes`](../../_20_protected_routes) |
| Layout Routes (per role) | [`_08_outlet_and_nested_routes`](../../_08_outlet_and_nested_routes) |
| useRoutes (dynamic) | [`_10_useRoutes`](../../_10_useRoutes) |
| Navigate (redirect) | [`_09_navigate_redirect`](../../_09_navigate_redirect) |
| useLocation | [`_06_useLocation`](../../_06_useLocation) |
| Error Boundaries | [`_21_error_boundaries`](../../_21_error_boundaries) |

---

## 🛣️ Routing Approach

```jsx
// guards/RoleGuard.jsx
function RoleGuard({ allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

// App.jsx — Role-based routing
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/unauthorized" element={<Unauthorized />} />

  <Route element={<ProtectedRoute />}>
    <Route element={<DashboardLayout />}>
      {/* Everyone can access */}
      <Route path="/dashboard" element={<Overview />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/projects" element={<Projects />} />

      {/* Manager + Admin only */}
      <Route element={<RoleGuard allowedRoles={["admin", "manager"]} />}>
        <Route path="/reports" element={<Reports />} />
        <Route path="/team" element={<TeamManagement />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route>

      {/* Admin only */}
      <Route element={<RoleGuard allowedRoles={["admin"]} />}>
        <Route path="/billing" element={<Billing />} />
        <Route path="/settings" element={<SystemSettings />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/audit-log" element={<AuditLog />} />
      </Route>
    </Route>
  </Route>
</Routes>
```

```jsx
// Dynamic sidebar based on role
function Sidebar() {
  const { user } = useAuth();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", roles: ["user", "manager", "admin"] },
    { path: "/projects", label: "Projects", roles: ["user", "manager", "admin"] },
    { path: "/reports", label: "Reports", roles: ["manager", "admin"] },
    { path: "/team", label: "Team", roles: ["manager", "admin"] },
    { path: "/analytics", label: "Analytics", roles: ["manager", "admin"] },
    { path: "/billing", label: "Billing", roles: ["admin"] },
    { path: "/users", label: "Users", roles: ["admin"] },
    { path: "/settings", label: "Settings", roles: ["admin"] },
  ];

  const visibleItems = menuItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <nav>
      {visibleItems.map((item) => (
        <NavLink key={item.path} to={item.path}>{item.label}</NavLink>
      ))}
    </nav>
  );
}
```

---

## ✅ What You'll Learn

1. How to implement **role-based route guards** at multiple levels
2. How to show **403 Unauthorized** vs **404 Not Found** appropriately
3. How to build **dynamic navigation** that adapts to user roles
4. How to **stack multiple guards** (auth + role check)
5. Production pattern for **SaaS multi-tenant routing**

---

## 🎯 Practice Tasks

- [ ] Add permission-based access (not just roles) — e.g., `can_view_reports`
- [ ] Implement an admin impersonation feature (view as another role)
- [ ] Add a loading state while checking permissions
- [ ] Handle role changes in real-time (WebSocket notifies role update)
- [ ] Add an activity log that tracks route access attempts
