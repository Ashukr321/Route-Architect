# 📌 09 - Navigate Component (Redirect)

## 🔗 Official Docs
- [Navigate](https://reactrouter.com/start/library/navigating)

---

## 📖 What is Navigate?

`<Navigate>` is a **component** that redirects the user to a different route when it renders. It's the declarative version of `useNavigate`.

---

## 1️⃣ Basic Redirect

```jsx
import { Navigate } from "react-router";

function OldPage() {
  // Immediately redirects to /new-page
  return <Navigate to="/new-page" />;
}
```

---

## 2️⃣ Redirect with Replace

```jsx
// Replace current history entry (user can't press back)
<Navigate to="/login" replace />
```

---

## 3️⃣ Conditional Redirect

```jsx
import { Navigate } from "react-router";

function Dashboard() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <div>Welcome to Dashboard!</div>;
}
```

---

## 4️⃣ Default Route Redirect

```jsx
<Routes>
  <Route path="/" element={<Navigate to="/dashboard" replace />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/login" element={<Login />} />
</Routes>
```

---

## 5️⃣ Redirect with State

```jsx
function ProtectedPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ from: "/protected-page", message: "Please log in first" }}
      />
    );
  }

  return <div>Protected Content</div>;
}

// In Login component, access the redirect info:
function Login() {
  const location = useLocation();
  const { from, message } = location.state || {};
  
  return (
    <div>
      {message && <p className="warning">{message}</p>}
      <LoginForm redirectTo={from || "/dashboard"} />
    </div>
  );
}
```

---

## 6️⃣ Navigate vs useNavigate

| Feature | `<Navigate>` | `useNavigate` |
|---------|:----------:|:-------------:|
| Type | Component | Hook |
| Usage | In JSX (render) | In event handlers |
| When | During rendering | After events |
| Declarative | ✅ | ❌ |

### When to use which:
```jsx
// ✅ Use <Navigate> for conditional redirects during render
function ProtectedRoute({ children }) {
  const { isAuth } = useAuth();
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
}

// ✅ Use useNavigate for redirects after events
function LoginForm() {
  const navigate = useNavigate();
  const handleSubmit = async () => {
    await login();
    navigate("/dashboard");
  };
}
```

---

## 7️⃣ Route-Level Redirect Pattern

```jsx
<Routes>
  {/* Redirect old URLs to new ones */}
  <Route path="/old-about" element={<Navigate to="/about" replace />} />
  <Route path="/old-blog/*" element={<Navigate to="/blog" replace />} />
  
  {/* Default redirect */}
  <Route path="/" element={<Navigate to="/home" replace />} />
  
  {/* Actual routes */}
  <Route path="/home" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/blog" element={<Blog />} />
</Routes>
```

---

## 📊 Navigate Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `to` | string | required | Destination path |
| `replace` | boolean | `false` | Replace history entry |
| `state` | any | `undefined` | State for destination |

---

## 🧠 Key Points to Remember

1. `<Navigate>` is for **declarative redirects** (during rendering)
2. Always use `replace` for **authentication redirects** to prevent back-button issues
3. Use `state` prop to pass **context** about why the redirect happened
4. Prefer **`useNavigate`** for event-driven navigation (button clicks, form submits)
5. Prefer **`<Navigate>`** for render-time conditional redirects
6. Good for **URL migrations** (redirecting old URLs to new ones)
