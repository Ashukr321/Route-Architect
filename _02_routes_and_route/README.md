# 📌 02 - Routes & Route Configuration

## 🔗 Official Docs
- [Routing](https://reactrouter.com/start/library/routing)

---

## 📖 What are Routes & Route?

- `<Routes>` is a **container** that wraps all your `<Route>` components
- `<Route>` defines a **mapping** between a URL path and a React component

---

## 1️⃣ Basic Route Configuration

```jsx
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 2️⃣ Index Routes

Index routes render into their parent's `<Outlet />` at the parent's URL — like a **default child route**.

```jsx
<Routes>
  <Route path="/" element={<Root />}>
    {/* Renders at "/" inside Root's <Outlet /> */}
    <Route index element={<Home />} />
    
    <Route path="dashboard" element={<Dashboard />}>
      {/* Renders at "/dashboard" inside Dashboard's <Outlet /> */}
      <Route index element={<DashboardHome />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  </Route>
</Routes>
```

> ⚠️ **Note**: Index routes **cannot** have children.

---

## 3️⃣ Dynamic Segments (URL Parameters)

If a path segment starts with `:`, it becomes a **dynamic segment**.

```jsx
<Route path="teams/:teamId" element={<Team />} />
```

```jsx
// Accessing the dynamic segment
import { useParams } from "react-router";

export default function Team() {
  let { teamId } = useParams();
  return <h1>Team ID: {teamId}</h1>;
}
```

### Multiple Dynamic Segments:
```jsx
<Route path="/c/:categoryId/p/:productId" element={<Product />} />
```

---

## 4️⃣ Optional Segments

Add `?` to make a segment **optional**:

```jsx
{/* Matches both "/categories" and "/en/categories" */}
<Route path=":lang?/categories" element={<Categories />} />

{/* Matches both "/users/123" and "/users/123/edit" */}
<Route path="users/:userId/edit?" element={<User />} />
```

---

## 5️⃣ Splat Routes (Catch-All)

Use `/*` to match **anything** after a path:

```jsx
<Route path="files/*" element={<FileViewer />} />
```

```jsx
import { useParams } from "react-router";

function FileViewer() {
  let { "*": splat } = useParams();
  // URL: /files/docs/readme.md → splat = "docs/readme.md"
  return <p>File path: {splat}</p>;
}
```

---

## 6️⃣ Route Prefixes

A `<Route>` with `path` but **no `element`** adds a path prefix:

```jsx
<Route path="projects">
  <Route index element={<ProjectsHome />} />
  <Route path=":pid" element={<Project />} />
  <Route path=":pid/edit" element={<EditProject />} />
</Route>
```

---

## 7️⃣ No Match Route (404 Page)

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  {/* Catch all unmatched routes */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

## 📊 Route Props Summary

| Prop | Type | Description |
|------|------|-------------|
| `path` | string | URL pattern to match |
| `element` | JSX | Component to render |
| `index` | boolean | Default child route |
| `children` | Route[] | Nested routes |

---

## 🧠 Key Points to Remember

1. `<Routes>` **replaces** the old `<Switch>` from React Router v5
2. Routes are **matched from top to bottom** but React Router v6+ uses a **ranking system** for best match
3. **Dynamic segments** use `:paramName` syntax
4. **Index routes** are default children that render when parent path matches exactly
5. **Splat routes** (`*`) catch everything — useful for 404 pages
6. All `<Route>` components must be **direct children** of `<Routes>` or other `<Route>` components
