# 📌 14 - useLoaderData Hook

## 🔗 Official Docs
- [useLoaderData](https://reactrouter.com/start/data/custom)

---

## 📖 What is useLoaderData?

`useLoaderData` returns the **data from the route's `loader`** function. It gives you the data that was loaded before the component rendered.

> ⚠️ **Only available with Data Routers** (`createBrowserRouter`)

---

## 1️⃣ Basic Usage

```jsx
import { createBrowserRouter, useLoaderData } from "react-router";

// Loader function
async function usersLoader() {
  const res = await fetch("/api/users");
  return res.json();
}

// Route config
const router = createBrowserRouter([
  {
    path: "/users",
    element: <Users />,
    loader: usersLoader,
  },
]);

// Component — data is ready, no loading state needed!
function Users() {
  const users = useLoaderData();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## 2️⃣ With Dynamic Params

```jsx
async function userLoader({ params }) {
  const res = await fetch(`/api/users/${params.userId}`);
  if (!res.ok) throw new Response("User not found", { status: 404 });
  return res.json();
}

const router = createBrowserRouter([
  {
    path: "/users/:userId",
    element: <UserProfile />,
    loader: userLoader,
    errorElement: <UserNotFound />,
  },
]);

function UserProfile() {
  const user = useLoaderData();

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

---

## 3️⃣ Parent + Child Loader Data

```jsx
import { useLoaderData, useRouteLoaderData, Outlet } from "react-router";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <Root />,
    loader: rootLoader,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
        loader: dashboardLoader,
      },
    ],
  },
]);

// Root gets its own loader data
function Root() {
  const { user } = useLoaderData(); // Data from rootLoader
  return (
    <div>
      <p>Welcome, {user.name}</p>
      <Outlet />
    </div>
  );
}

// Dashboard gets its own AND can access parent's data
function Dashboard() {
  const dashData = useLoaderData();              // From dashboardLoader
  const rootData = useRouteLoaderData("root");   // From rootLoader (by route ID)

  return (
    <div>
      <p>User: {rootData.user.name}</p>
      <p>Stats: {dashData.totalOrders}</p>
    </div>
  );
}
```

---

## 4️⃣ useRouteLoaderData — Access Any Route's Data

```jsx
import { useRouteLoaderData } from "react-router";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <Root />,
    loader: () => fetch("/api/user").then(r => r.json()),
    children: [
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

// Any child route can access the root loader's data by route ID
function Settings() {
  const rootData = useRouteLoaderData("root");
  return <p>Logged in as: {rootData.name}</p>;
}
```

---

## 5️⃣ Loader Data After Action (Auto Revalidation)

```jsx
// After an action runs, loaders automatically re-run
// and useLoaderData returns the FRESH data

function ContactList() {
  const contacts = useLoaderData(); // Always up-to-date!

  return (
    <div>
      {/* After adding a contact via action, this list auto-updates */}
      {contacts.map((c) => (
        <div key={c.id}>{c.name}</div>
      ))}
    </div>
  );
}
```

---

## 📊 useLoaderData vs useRouteLoaderData

| Hook | Access | Usage |
|------|--------|-------|
| `useLoaderData` | Current route's loader data | In the route's own component |
| `useRouteLoaderData("id")` | Any route's loader data by ID | In any descendant component |

---

## 🧠 Key Points to Remember

1. `useLoaderData` returns data from the **current route's loader**
2. Data is available **immediately** — the loader runs before the component renders
3. Use `useRouteLoaderData("routeId")` to access **parent/ancestor** route data
4. After actions, loaders **automatically revalidate** — data is always fresh
5. **No loading spinners** needed in the component — the data is pre-loaded
6. Must assign `id` to routes if you want to use `useRouteLoaderData`
