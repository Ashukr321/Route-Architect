# 📌 06 - useLocation Hook

## 🔗 Official Docs
- [useLocation](https://reactrouter.com/start/library/url-values)

---

## 📖 What is useLocation?

`useLocation` returns the **current location object**. It contains information about the current URL including pathname, search query, hash, state, and key.

---

## 1️⃣ Basic Usage

```jsx
import { useLocation } from "react-router";

function CurrentPage() {
  const location = useLocation();
  
  console.log(location);
  // {
  //   pathname: "/dashboard/settings",
  //   search: "?tab=profile",
  //   hash: "#section1",
  //   state: { from: "login" },
  //   key: "abc123"
  // }

  return <p>You are at: {location.pathname}</p>;
}
```

---

## 2️⃣ Location Object Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `pathname` | string | The path of the URL | `/dashboard/settings` |
| `search` | string | The query string | `?tab=profile&sort=asc` |
| `hash` | string | The URL hash | `#section1` |
| `state` | any | State passed via Link/navigate | `{ from: "login" }` |
| `key` | string | Unique key for this location | `"abc123"` |

---

## 3️⃣ Reading Query Parameters

```jsx
import { useLocation } from "react-router";

function SearchPage() {
  const location = useLocation();
  
  // Parse search params manually
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q");
  const page = queryParams.get("page");

  return (
    <div>
      <p>Search query: {query}</p>
      <p>Page: {page}</p>
    </div>
  );
}

// URL: /search?q=react&page=2
// query = "react", page = "2"
```

> 💡 **Tip**: Use `useSearchParams` hook instead for a better API (covered in `_07_useSearchParams`)

---

## 4️⃣ Reading State from Navigation

```jsx
// Sender component
import { Link } from "react-router";

function ProductList() {
  return (
    <Link to="/product/1" state={{ from: "product-list", discount: true }}>
      View Product
    </Link>
  );
}

// Receiver component
import { useLocation } from "react-router";

function ProductDetail() {
  const location = useLocation();
  const { from, discount } = location.state || {};

  return (
    <div>
      <p>Came from: {from}</p>
      {discount && <p>🎉 Special discount applied!</p>}
    </div>
  );
}
```

---

## 5️⃣ Track Page Changes (Analytics)

```jsx
import { useLocation } from "react-router";
import { useEffect } from "react";

function App() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on every route change
    analytics.trackPageView(location.pathname);
    console.log("Page changed to:", location.pathname);
  }, [location]);

  return <Outlet />;
}
```

---

## 6️⃣ Conditional Rendering Based on Location

```jsx
import { useLocation } from "react-router";

function Header() {
  const location = useLocation();

  // Hide header on login/register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <header>
      <h1>My App</h1>
      <nav>{/* navigation links */}</nav>
    </header>
  );
}
```

---

## 7️⃣ Scroll to Top on Route Change

```jsx
import { useLocation } from "react-router";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Usage: Place inside the Router
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>{/* ... */}</Routes>
    </BrowserRouter>
  );
}
```

---

## 🧠 Key Points to Remember

1. `useLocation` gives you the **full location object** of current URL
2. It **re-renders** the component on every navigation
3. `state` is great for passing **temporary data** (not visible in URL)
4. Use it for **analytics tracking**, **conditional rendering**, and **scroll management**
5. For query params, prefer `useSearchParams` over manually parsing `location.search`
6. `location.key` is unique per navigation — useful for caching per-location state
