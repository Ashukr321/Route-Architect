# 🎯 Project 05 — Authentication Flow (Login/Register/Forgot Password)

## 📊 Difficulty: ⭐⭐ Intermediate

---

## 📋 Situation / Use Case

You're implementing a **complete authentication flow** with Login, Register, Forgot Password, and Reset Password pages. After login, users should be redirected to where they originally wanted to go. Protected pages should redirect unauthenticated users to login.

**Client Requirement**: "Users who are already logged in shouldn't see the login page — redirect them to the dashboard. Users who aren't logged in should be sent to login and brought back to their original page after authentication."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| Protected Routes | [`_20_protected_routes`](../../_20_protected_routes) |
| Navigate (Redirect) | [`_09_navigate_redirect`](../../_09_navigate_redirect) |
| useNavigate | [`_04_useNavigate`](../../_04_useNavigate) |
| useLocation (state) | [`_06_useLocation`](../../_06_useLocation) |
| Layout Routes | [`_08_outlet_and_nested_routes`](../../_08_outlet_and_nested_routes) |
| Link (state passing) | [`_03_link_and_navlink`](../../_03_link_and_navlink) |

---

## 🏗️ Project Setup

```bash
npm create vite@latest auth-flow -- --template react
cd auth-flow
npm install react-router
npm run dev
```

---

## 📁 Folder Structure

```
src/
├── App.jsx
├── context/
│   └── AuthContext.jsx
├── guards/
│   ├── ProtectedRoute.jsx
│   └── GuestRoute.jsx
├── layouts/
│   ├── AuthLayout.jsx
│   └── AppLayout.jsx
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   ├── Dashboard.jsx
│   ├── Profile.jsx
│   └── Home.jsx
```

---

## 🛣️ Routing Approach

```jsx
// App.jsx
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Guest Only — logged-in users get redirected away */}
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>
        </Route>

        {/* Protected — only logged-in users */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
```

```jsx
// guards/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save where they wanted to go in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
```

```jsx
// guards/GuestRoute.jsx — prevents logged-in users from seeing login page
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

function GuestRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
```

```jsx
// pages/auth/Login.jsx
import { useNavigate, useLocation, Link } from "react-router";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Where to go after login
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await login(formData.get("email"), formData.get("password"));
    navigate(from, { replace: true });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      {location.state?.from && (
        <p className="info">Please log in to access {from}</p>
      )}
      <input name="email" type="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
      <Link to="/forgot-password">Forgot Password?</Link>
      <Link to="/register">Don't have an account? Register</Link>
    </form>
  );
}
```

```jsx
// context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // API call here
    const userData = { id: 1, email, name: "Ashutosh" };
    setUser(userData);
    localStorage.setItem("token", "fake-jwt-token");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

## ✅ What You'll Learn

1. How to build **Protected Routes** with `<Navigate>` and `<Outlet>`
2. How to create **Guest Routes** (redirect logged-in users away from login)
3. How to **pass location state** for "redirect after login" flow
4. How to **stack layout routes** (GuestRoute → AuthLayout → Login)
5. The **full auth flow** pattern used in production apps
6. How to use **Context API** with routing for authentication

---

## 🎯 Practice Tasks

- [ ] Add a "Remember Me" checkbox that persists login
- [ ] Show a toast message after successful login
- [ ] Implement the reset password flow with token validation
- [ ] Add a loading spinner while checking auth status
- [ ] Handle token expiration and auto-logout
