# 📌 19 - useRouteError Hook

## 🔗 Official Docs
- [Error Handling](https://reactrouter.com/start/data/custom)

---

## 📖 What is useRouteError?

`useRouteError` returns the **error that was thrown** during route loading, rendering, or action execution. It's used inside `errorElement` components to access and display error information.

> ⚠️ **Only available with Data Routers** (`createBrowserRouter`)

---

## 1️⃣ Basic Usage

```jsx
import { useRouteError } from "react-router";

function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

// Route config
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
        loader: contactLoader,
      },
    ],
  },
]);
```

---

## 2️⃣ Handling Different Error Types

```jsx
import { useRouteError, isRouteErrorResponse } from "react-router";

function ErrorBoundary() {
  const error = useRouteError();

  // Check if it's a Response thrown from loader/action
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status}</h1>
        <p>{error.statusText}</p>
        {error.status === 404 && <p>Page not found!</p>}
        {error.status === 401 && <p>You are not authorized!</p>}
        {error.status === 500 && <p>Server error!</p>}
      </div>
    );
  }

  // It's a regular Error
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}
```

---

## 3️⃣ Throwing Errors in Loaders

```jsx
async function contactLoader({ params }) {
  const response = await fetch(`/api/contacts/${params.contactId}`);

  if (response.status === 404) {
    throw new Response("Contact not found", { status: 404 });
  }

  if (!response.ok) {
    throw new Response("Failed to load contact", { status: response.status });
  }

  return response.json();
}
```

---

## 4️⃣ Route-Level vs Root-Level Error Boundaries

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <RootErrorPage />,  // Catches all unhandled errors
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
        errorElement: <DashboardError />,  // Catches dashboard-specific errors
        loader: dashboardLoader,
      },
      {
        path: "profile",
        element: <Profile />,
        // No errorElement → bubbles up to root
        loader: profileLoader,
      },
    ],
  },
]);
```

### Error bubbling:
```
Dashboard error → <DashboardError /> (route-level)
Profile error   → <RootErrorPage />  (bubbles to root)
```

---

## 5️⃣ Custom Error Page with Navigation

```jsx
import { useRouteError, Link, useNavigate } from "react-router";

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <h1>😵 Oops!</h1>
      <p>Something went wrong.</p>
      <p className="error-detail">{error.message || error.statusText}</p>

      <div className="error-actions">
        <button onClick={() => navigate(-1)}>← Go Back</button>
        <Link to="/">Go Home</Link>
        <button onClick={() => window.location.reload()}>
          🔄 Retry
        </button>
      </div>
    </div>
  );
}
```

---

## 📊 Error Types

| Error Type | Source | How to Throw |
|-----------|--------|-------------|
| Response | loader/action | `throw new Response("msg", { status: 404 })` |
| Error | Component render | `throw new Error("msg")` |
| Any | loader/action | `throw "anything"` |

---

## 🧠 Key Points to Remember

1. `useRouteError` accesses the **error that was thrown** in the route tree
2. Use `isRouteErrorResponse()` to check if it's a **Response error** (with status code)
3. Errors **bubble up** to parent route error boundaries if not caught at route level
4. Each route can have its **own `errorElement`** for granular error handling
5. You can throw **Response objects** for HTTP-like errors (404, 401, 500)
6. The root `errorElement` acts as the **fallback** for all unhandled errors
