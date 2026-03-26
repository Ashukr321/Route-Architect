# 📌 12 - loader (Route Data Loading)

## 🔗 Official Docs
- [Loaders](https://reactrouter.com/start/data/custom)

---

## 📖 What is a loader?

A `loader` is a function defined on a route that **fetches data before the route component renders**. The data is then available via `useLoaderData()`.

> ⚠️ **Only available with Data Routers** (`createBrowserRouter`)

---

## 1️⃣ Basic Loader

```jsx
import { createBrowserRouter, useLoaderData } from "react-router";

// Define the loader function
async function productsLoader() {
  const response = await fetch("/api/products");
  const products = await response.json();
  return products;
}

// Use in route config
const router = createBrowserRouter([
  {
    path: "/products",
    element: <Products />,
    loader: productsLoader,
  },
]);

// Access data in component
function Products() {
  const products = useLoaderData();

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

---

## 2️⃣ Loader with Params

```jsx
async function productLoader({ params }) {
  const response = await fetch(`/api/products/${params.productId}`);
  if (!response.ok) {
    throw new Response("Product not found", { status: 404 });
  }
  return response.json();
}

const router = createBrowserRouter([
  {
    path: "/products/:productId",
    element: <ProductDetail />,
    loader: productLoader,
  },
]);

function ProductDetail() {
  const product = useLoaderData();
  return <h1>{product.name}</h1>;
}
```

---

## 3️⃣ Loader with Request (Search Params)

```jsx
async function searchLoader({ request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const page = url.searchParams.get("page") || "1";

  const response = await fetch(`/api/search?q=${query}&page=${page}`);
  return response.json();
}

const router = createBrowserRouter([
  {
    path: "/search",
    element: <SearchResults />,
    loader: searchLoader,
  },
]);
```

---

## 4️⃣ Loader Arguments

```jsx
async function myLoader({ params, request }) {
  // params — URL dynamic segments
  console.log(params.userId);  // from /users/:userId

  // request — the Fetch Request object
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("q");

  return { userId: params.userId, searchTerm };
}
```

| Argument | Type | Description |
|----------|------|-------------|
| `params` | object | Dynamic route parameters |
| `request` | Request | The Fetch Request being made |

---

## 5️⃣ Returning Responses

```jsx
// Return plain data
async function loader() {
  return { name: "John", age: 30 };
}

// Return a Response object
async function loader() {
  return new Response(JSON.stringify({ name: "John" }), {
    headers: { "Content-Type": "application/json" },
  });
}

// Throw errors for error boundaries
async function loader() {
  const res = await fetch("/api/data");
  if (res.status === 404) {
    throw new Response("Not Found", { status: 404 });
  }
  return res.json();
}
```

---

## 6️⃣ Redirect from Loader

```jsx
import { redirect } from "react-router";

async function protectedLoader() {
  const user = await getUser();
  if (!user) {
    return redirect("/login");
  }
  return user;
}
```

---

## 7️⃣ Multiple Loaders in Nested Routes

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,  // Loads first
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
        loader: dashboardLoader,  // Loads in parallel with rootLoader!
      },
    ],
  },
]);
```

> 💡 **Nested loaders run in parallel** — React Router fetches all data simultaneously!

---

## 🧠 Key Points to Remember

1. Loaders run **before** the component renders — no loading spinners needed in the component
2. **Only works** with Data Routers (`createBrowserRouter`)
3. Access loader data with `useLoaderData()` hook
4. Loaders receive `params` and `request` as arguments
5. **Throw** errors to trigger `errorElement` boundaries
6. Use `redirect()` to redirect from a loader
7. Nested route loaders run **in parallel** for optimal performance
