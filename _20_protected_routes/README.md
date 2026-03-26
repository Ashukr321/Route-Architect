# 📌 20 - Protected Routes / Auth Guards

## 🔗 Official Docs
- [React Router Auth Example](https://reactrouter.com/start/library/routing)

---

## 📖 What are Protected Routes?

Protected Routes prevent **unauthorized users** from accessing certain pages. If a user is not authenticated, they're redirected to a login page (or an access-denied page).

---

## 1️⃣ Basic Protected Route Component

```jsx
import { Navigate, useLocation } from "react-router";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth(); // Your auth context
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login and remember where they wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
```

### Usage in Routes:
```jsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>
```

---

## 2️⃣ Protected Layout Route (Better Pattern)

```jsx
import { Navigate, Outlet, useLocation } from "react-router";

function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

// Route Config — protect multiple routes at once!
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* All children are protected */}
  <Route element={<ProtectedLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/settings" element={<Settings />} />
  </Route>
</Routes>
```

---

## 3️⃣ Role-Based Access Control

```jsx
function RoleGuard({ allowedRoles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// Usage:
<Routes>
  <Route
    path="/admin"
    element={
      <RoleGuard allowedRoles={["admin"]}>
        <AdminPanel />
      </RoleGuard>
    }
  />
  <Route
    path="/editor"
    element={
      <RoleGuard allowedRoles={["admin", "editor"]}>
        <EditorDashboard />
      </RoleGuard>
    }
  />
</Routes>
```

---

## 4️⃣ Redirect After Login

```jsx
function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page they were trying to visit
  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (credentials) => {
    await login(credentials);
    // Redirect back to where they came from
    navigate(from, { replace: true });
  };

  return (
    <form onSubmit={handleLogin}>
      <p>You must log in to view this page.</p>
      <input name="username" />
      <input name="password" type="password" />
      <button>Login</button>
    </form>
  );
}
```

---

## 5️⃣ Auth Context Setup

```jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const userData = await authenticateAPI(credentials);
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
```

---

## 6️⃣ With Data Router (loader-based protection)

```jsx
import { redirect } from "react-router";

// Protect at the loader level
async function protectedLoader() {
  const user = await getUser();
  if (!user) {
    return redirect("/login");
  }
  return user;
}

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />,
    loader: protectedLoader,
  },
]);
```

---

## 📊 Protection Patterns Comparison

| Pattern | Approach | Best For |
|---------|----------|----------|
| Wrapper Component | `<ProtectedRoute>` wraps individual routes | Simple apps |
| Layout Route | `<Route element={<ProtectedLayout />}>` | Multiple protected routes |
| Role Guard | Check `user.role` | Role-based access |
| Loader Redirect | `redirect()` in loader | Data router apps |

---

## 🧠 Key Points to Remember

1. **Layout Route pattern** is the cleanest for protecting multiple routes
2. Always **save the original destination** (`state.from`) for redirect after login
3. Use `replace` on `<Navigate>` to **prevent the login redirect from appearing in history**
4. Combine with **Role-based guards** for fine-grained access control
5. In Data Routers, you can protect routes at the **loader level** with `redirect()`
6. Create an **AuthContext** to share auth state across the app
