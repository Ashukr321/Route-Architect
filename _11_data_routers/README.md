# 📌 11 - Data Routers (createBrowserRouter & RouterProvider)

## 🔗 Official Docs
- [Data Mode](https://reactrouter.com/start/data/custom)

---

## 📖 What are Data Routers?

Data Routers are the **modern approach** to routing in React Router. They move route configuration **outside of React rendering** and enable powerful data APIs like `loader`, `action`, and `useFetcher`.

---

## 1️⃣ createBrowserRouter (Most Common Data Router)

```jsx
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        loader: dashboardLoader,
        children: [
          { index: true, element: <DashboardHome /> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

---

## 2️⃣ Available Data Routers

| Router | Use Case |
|--------|----------|
| `createBrowserRouter` | Standard web apps (HTML5 History API) |
| `createHashRouter` | When server can't handle all routes |
| `createMemoryRouter` | Testing & non-browser environments |

### createHashRouter:
```jsx
import { createHashRouter, RouterProvider } from "react-router";

const router = createHashRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
]);
```

### createMemoryRouter (for testing):
```jsx
import { createMemoryRouter, RouterProvider } from "react-router";

const router = createMemoryRouter(
  [{ path: "/", element: <Home /> }],
  { initialEntries: ["/"] }
);
```

---

## 3️⃣ Full Data Router Setup

```jsx
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

// Define route with loader and action
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home />, loader: homeLoader },
      {
        path: "contacts/:contactId",
        element: <Contact />,
        loader: contactLoader,
        action: contactAction,
      },
      {
        path: "contacts/:contactId/edit",
        element: <EditContact />,
        loader: contactLoader,
        action: editAction,
      },
    ],
  },
]);

// Render the app
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
```

---

## 4️⃣ Route Object Properties (Data Mode)

```typescript
interface RouteObject {
  path?: string;
  index?: boolean;
  element?: React.ReactNode;
  Component?: React.ComponentType;      // Alternative to element
  children?: RouteObject[];
  
  // 🆕 Data APIs (only available in Data Routers!)
  loader?: LoaderFunction;
  action?: ActionFunction;
  errorElement?: React.ReactNode;
  ErrorBoundary?: React.ComponentType;
  shouldRevalidate?: Function;
  lazy?: () => Promise<RouteObject>;     // Lazy loading
}
```

---

## 5️⃣ Declarative vs Data Router Comparison

### Declarative Mode (BrowserRouter):
```jsx
// Simple, no data APIs
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</BrowserRouter>
```

### Data Mode (createBrowserRouter):
```jsx
// Full data APIs: loaders, actions, error boundaries
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: homeLoader,
    action: homeAction,
    errorElement: <ErrorPage />,
  },
]);

<RouterProvider router={router} />
```

---

## 📊 Feature Comparison

| Feature | BrowserRouter | createBrowserRouter |
|---------|:------------:|:-------------------:|
| Basic routing | ✅ | ✅ |
| `<Link>` / `<NavLink>` | ✅ | ✅ |
| `useNavigate` | ✅ | ✅ |
| `useParams` | ✅ | ✅ |
| `loader` | ❌ | ✅ |
| `action` | ❌ | ✅ |
| `useFetcher` | ❌ | ✅ |
| `useLoaderData` | ❌ | ✅ |
| `errorElement` | ❌ | ✅ |
| Pending states | ❌ | ✅ |
| `lazy` routes | ❌ | ✅ |

---

## 🧠 Key Points to Remember

1. **Data Routers** unlock powerful data loading and mutation APIs
2. Route config is defined **outside** of React (as objects)
3. `RouterProvider` replaces `BrowserRouter` as the top-level component
4. Each route can have its own `loader`, `action`, and `errorElement`
5. **Start with Data Routers** if building a new app — they're the modern approach
6. Existing apps using `<BrowserRouter>` can **gradually migrate** to data routers
