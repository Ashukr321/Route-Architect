# 📌 04 - useNavigate Hook

## 🔗 Official Docs
- [useNavigate](https://reactrouter.com/start/library/navigating#usenavigate)

---

## 📖 What is useNavigate?

`useNavigate` is a hook that returns a function to **programmatically navigate** the user to a different route — without requiring user interaction like clicking a link.

---

## 1️⃣ Basic Usage

```jsx
import { useNavigate } from "react-router";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const success = await loginUser();
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
```

---

## 2️⃣ Navigate with Options

```jsx
const navigate = useNavigate();

// Simple navigation
navigate("/dashboard");

// Replace current history entry (no back button)
navigate("/dashboard", { replace: true });

// Pass state data
navigate("/profile", { state: { from: "login", userId: 123 } });

// Both replace and state
navigate("/home", { replace: true, state: { message: "Welcome back!" } });
```

---

## 3️⃣ Navigate Relative Paths

```jsx
const navigate = useNavigate();

// Go to a relative path
navigate("settings");        // Relative to current route
navigate("../profile");      // Go up one level, then to profile
```

---

## 4️⃣ Navigate with History (Go Back / Forward)

```jsx
const navigate = useNavigate();

// Go back one page (same as browser back button)
navigate(-1);

// Go back two pages
navigate(-2);

// Go forward one page
navigate(1);
```

---

## 5️⃣ Common Use Cases

### After Form Submission:
```jsx
function CreatePost() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    const post = await createPost(formData);
    navigate(`/posts/${post.id}`, { replace: true });
  };

  return <PostForm onSubmit={handleSubmit} />;
}
```

### After Logout:
```jsx
function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthTokens();
    navigate("/login", { replace: true });
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### Conditional Redirect:
```jsx
function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return <div>Welcome to Dashboard!</div>;
}
```

### Timed Redirect:
```jsx
function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/orders");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return <p>Payment successful! Redirecting in 3 seconds...</p>;
}
```

---

## 📊 navigate() API

| Argument | Type | Description |
|----------|------|-------------|
| `to` | string \| number | Path or history delta |
| `options.replace` | boolean | Replace instead of push |
| `options.state` | any | State data for destination |
| `options.preventScrollReset` | boolean | Prevent scroll reset |

---

## 🧠 Key Points to Remember

1. **Prefer `<Link>` and `<NavLink>`** for user-initiated navigation (better accessibility)
2. Use `useNavigate` for **programmatic navigation** (after form submit, logout, timers, etc.)
3. `navigate(-1)` is like the **browser back button**
4. Use `replace: true` when you **don't want the user to go back** (e.g., after login)
5. `state` data is available via `useLocation().state` in the destination component
6. **Don't call navigate during rendering** — use it inside event handlers or `useEffect`
