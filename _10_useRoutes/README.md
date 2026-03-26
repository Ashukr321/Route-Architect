# 📌 10 - useRoutes Hook

## 🔗 Official Docs
- [useRoutes](https://reactrouter.com/start/library/routing)

---

## 📖 What is useRoutes?

`useRoutes` is the **functional equivalent** of `<Routes>`. It lets you define your routes as **JavaScript objects** instead of JSX `<Route>` elements.

---

## 1️⃣ Basic Usage

```jsx
import { useRoutes } from "react-router";

function App() {
  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/about", element: <About /> },
    { path: "/contact", element: <Contact /> },
    { path: "*", element: <NotFound /> },
  ]);

  return routes;
}
```

This is equivalent to:
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

## 2️⃣ Nested Routes with useRoutes

```jsx
import { useRoutes } from "react-router";

function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "about", element: <About /> },
        {
          path: "dashboard",
          element: <DashboardLayout />,
          children: [
            { index: true, element: <DashboardHome /> },
            { path: "profile", element: <Profile /> },
            { path: "settings", element: <Settings /> },
          ],
        },
      ],
    },
  ]);

  return routes;
}
```

---

## 3️⃣ Defining Routes in a Separate File

### routes.jsx:
```jsx
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const routeConfig = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "settings", element: <Settings /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];

export default routeConfig;
```

### App.jsx:
```jsx
import { useRoutes } from "react-router";
import routeConfig from "./routes";

function App() {
  return useRoutes(routeConfig);
}
```

---

## 4️⃣ Dynamic Route Generation

```jsx
const modules = [
  { name: "users", component: <Users /> },
  { name: "products", component: <Products /> },
  { name: "orders", component: <Orders /> },
];

function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        ...modules.map((mod) => ({
          path: mod.name,
          element: mod.component,
        })),
      ],
    },
  ]);

  return routes;
}
```

---

## 5️⃣ Route Object Shape

```typescript
interface RouteObject {
  path?: string;
  index?: boolean;
  element?: React.ReactNode;
  children?: RouteObject[];
  caseSensitive?: boolean;
  // Data mode only:
  loader?: Function;
  action?: Function;
  errorElement?: React.ReactNode;
}
```

---

## 📊 `<Routes>` JSX vs `useRoutes` Object

| Feature | `<Routes>` | `useRoutes` |
|---------|:----------:|:-----------:|
| Syntax | JSX | JavaScript Object |
| Readability | More visual | More programmatic |
| Dynamic routes | Harder | Easier |
| Separate file | Possible | Easier |
| Nesting | JSX children | `children` array |

---

## 🧠 Key Points to Remember

1. `useRoutes` is the **object-based alternative** to `<Routes>` JSX
2. Same functionality, just **different syntax**
3. Great for **large apps** where you want routes as data
4. Makes **dynamic route generation** easier
5. Easy to split routes into **separate files/modules**
6. Must be used **inside** a Router component (`<BrowserRouter>`)
