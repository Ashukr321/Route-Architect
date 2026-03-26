# 📌 21 - Error Boundaries (errorElement)

## 🔗 Official Docs
- [Error Handling](https://reactrouter.com/start/data/custom)

---

## 📖 What are Error Boundaries?

Error Boundaries in React Router catch errors thrown during **rendering**, **loader execution**, or **action execution** and display a fallback UI instead of crashing your entire app.

> ⚠️ `errorElement` is **only available with Data Routers** (`createBrowserRouter`)

---

## 1️⃣ Basic Error Boundary

```jsx
import { createBrowserRouter, useRouteError } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
    ],
  },
]);

function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="error-container">
      <h1>⚠️ Something went wrong!</h1>
      <p>{error.message || error.statusText}</p>
    </div>
  );
}
```

---

## 2️⃣ Route-Specific Error Boundaries

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <GlobalError />,      // Fallback for all
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
        errorElement: <DashboardError />, // Dashboard-specific
        loader: dashboardLoader,
      },
      {
        path: "users/:userId",
        element: <UserProfile />,
        errorElement: <UserNotFound />,   // User-specific
        loader: userLoader,
      },
    ],
  },
]);
```

---

## 3️⃣ 404 Not Found Page

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      // Catch-all for unknown routes
      {
        path: "*",
        element: <NotFound />,
      },
    ],
    errorElement: <GlobalError />,
  },
]);

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Go Home</Link>
    </div>
  );
}
```

---

## 4️⃣ Throwing Errors in Loaders/Actions

```jsx
// In a loader — throw Response for HTTP errors
async function userLoader({ params }) {
  const res = await fetch(`/api/users/${params.userId}`);

  if (res.status === 404) {
    throw new Response("User not found", { status: 404 });
  }
  if (res.status === 403) {
    throw new Response("Access denied", { status: 403 });
  }
  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }

  return res.json();
}
```

---

## 5️⃣ Comprehensive Error Page

```jsx
import { useRouteError, isRouteErrorResponse, Link, useNavigate } from "react-router";

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Something went wrong";
  let message = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        title = "404 — Not Found";
        message = "The page you're looking for doesn't exist.";
        break;
      case 401:
        title = "401 — Unauthorized";
        message = "You need to log in to access this page.";
        break;
      case 403:
        title = "403 — Forbidden";
        message = "You don't have permission to access this page.";
        break;
      case 500:
        title = "500 — Server Error";
        message = "Something went wrong on our end.";
        break;
      default:
        title = `${error.status} — ${error.statusText}`;
        message = error.data || "An error occurred.";
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="error-page">
      <h1>{title}</h1>
      <p>{message}</p>
      <div className="error-actions">
        <button onClick={() => navigate(-1)}>← Go Back</button>
        <Link to="/">🏠 Go Home</Link>
      </div>
    </div>
  );
}
```

---

## 6️⃣ Error Boundary vs React Error Boundary

| Feature | React Router `errorElement` | React `ErrorBoundary` |
|---------|:--------------------------:|:---------------------:|
| Catches loader errors | ✅ | ❌ |
| Catches action errors | ✅ | ❌ |
| Catches render errors | ✅ | ✅ |
| Route-scoped | ✅ | ❌ (tree-scoped) |
| Per-route config | ✅ | ❌ |
| Error bubbling | ✅ | ✅ |

---

## 🧠 Key Points to Remember

1. `errorElement` catches errors from **loaders**, **actions**, and **rendering**
2. Errors **bubble up** to parent error boundaries if not caught locally
3. Use `isRouteErrorResponse()` to handle **HTTP-like errors** differently
4. The root error boundary is the **last line of defense**
5. Use `throw new Response("msg", { status })` for **structured errors**
6. Add a `path="*"` route for **404 pages** inside your route tree
