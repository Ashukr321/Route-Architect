# 📌 22 - Lazy Loading Routes

## 🔗 Official Docs
- [Lazy Loading](https://reactrouter.com/start/data/custom)

---

## 📖 What is Lazy Loading Routes?

Lazy loading allows you to **split your code** so that route components are only loaded when the user navigates to them. This reduces the initial bundle size and improves app performance.

---

## 1️⃣ Using React.lazy + Suspense (Declarative Mode)

```jsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";

// Lazy import components
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loader">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

---

## 2️⃣ Using `lazy` Property (Data Router Mode)

```jsx
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "dashboard",
        lazy: async () => {
          const { Dashboard, dashboardLoader } = await import("./pages/Dashboard");
          return {
            element: <Dashboard />,
            loader: dashboardLoader,
          };
        },
      },
      {
        path: "settings",
        lazy: async () => {
          const { Settings } = await import("./pages/Settings");
          return { element: <Settings /> };
        },
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

> 💡 The `lazy` property in Data Routers loads **both the component AND its loader** on demand!

---

## 3️⃣ Lazy with Named Exports

```jsx
// pages/Dashboard.jsx
export function Component() {
  return <div>Dashboard</div>;
}

export async function loader() {
  return fetch("/api/dashboard").then(r => r.json());
}

// Route config — use simpler syntax
const router = createBrowserRouter([
  {
    path: "/dashboard",
    lazy: () => import("./pages/Dashboard"),
    // Automatically picks up named exports:
    // Component, loader, action, errorElement, etc.
  },
]);
```

---

## 4️⃣ Loading Indicator

### Declarative Mode:
```jsx
function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Loading page...</p>
    </div>
  );
}

<Suspense fallback={<LoadingSpinner />}>
  <Routes>{/* lazy routes */}</Routes>
</Suspense>
```

### Data Router Mode (HydrateFallback):
```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    hydrateFallbackElement: <LoadingSpinner />,
    children: [
      {
        path: "heavy-page",
        lazy: () => import("./pages/HeavyPage"),
      },
    ],
  },
]);
```

---

## 5️⃣ Route-Level Code Splitting Pattern

```jsx
// routes/index.jsx — Central route configuration
import { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Blog = lazy(() => import("../pages/Blog"));
const BlogPost = lazy(() => import("../pages/BlogPost"));
const Contact = lazy(() => import("../pages/Contact"));
const NotFound = lazy(() => import("../pages/NotFound"));

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/blog", element: <Blog /> },
  { path: "/blog/:slug", element: <BlogPost /> },
  { path: "/contact", element: <Contact /> },
  { path: "*", element: <NotFound /> },
];
```

---

## 6️⃣ Preloading Lazy Routes (Performance Tip)

```jsx
const Dashboard = lazy(() => import("./pages/Dashboard"));

function Sidebar() {
  // Preload when user hovers over the link
  const handleMouseEnter = () => {
    import("./pages/Dashboard");
  };

  return (
    <Link to="/dashboard" onMouseEnter={handleMouseEnter}>
      Dashboard
    </Link>
  );
}
```

---

## 📊 React.lazy vs Data Router lazy

| Feature | `React.lazy` | Route `lazy` property |
|---------|:------------:|:--------------------:|
| Mode | Declarative | Data Router |
| Loads | Component only | Component + loader + action |
| Fallback | `<Suspense>` | Built-in handling |
| Named exports | ❌ Default only | ✅ Component, loader, etc. |
| Simplicity | ✅ Simple | ✅ More powerful |

---

## 🧠 Key Points to Remember

1. Lazy loading **reduces initial bundle size** — pages load on demand
2. In Declarative mode, use `React.lazy()` + `<Suspense>`
3. In Data Router mode, use the `lazy` route property — it loads **everything** (component, loader, action)
4. Always provide a **loading fallback** for good UX
5. Consider **preloading** on hover for frequently visited routes
6. Named exports (`Component`, `loader`, `action`) work seamlessly with Data Router `lazy`
