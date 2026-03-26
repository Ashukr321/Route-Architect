# 🎯 Project 09 — E-Commerce Full Store (Data Router)

## 📊 Difficulty: ⭐⭐⭐ Intermediate-Advanced

---

## 📋 Situation / Use Case

You're building a **full e-commerce store** using Data Routers. Products are loaded via `loader`, cart operations use `action`, and the checkout is a multi-step process. Data revalidates automatically after mutations.

**Client Requirement**: "The store should load product data before showing the page (no loading spinners on initial load). Adding items to the cart should happen without page navigation. The cart count in the header should update immediately."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| createBrowserRouter | [`_11_data_routers`](../../_11_data_routers) |
| loader | [`_12_loader`](../../_12_loader) |
| action | [`_13_action`](../../_13_action) |
| useLoaderData | [`_14_useLoaderData`](../../_14_useLoaderData) |
| useFetcher (add to cart) | [`_16_useFetcher`](../../_16_useFetcher) |
| errorElement | [`_21_error_boundaries`](../../_21_error_boundaries) |
| Nested Routes + Outlet | [`_08_outlet_and_nested_routes`](../../_08_outlet_and_nested_routes) |

---

## 🛣️ Routing Approach

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <StoreLayout />,
    errorElement: <StoreError />,
    loader: rootLoader, // Loads cart count for header
    children: [
      { index: true, element: <Home />, loader: featuredLoader },
      {
        path: "products",
        element: <ProductList />,
        loader: productsLoader, // Loads all products
      },
      {
        path: "products/:productId",
        element: <ProductDetail />,
        loader: productLoader,
        action: addToCartAction,
        errorElement: <ProductNotFound />,
      },
      {
        path: "cart",
        element: <Cart />,
        loader: cartLoader,
        action: cartAction, // Update quantity, remove item
      },
      {
        path: "checkout",
        element: <Checkout />,
        loader: checkoutLoader,
        action: placeOrderAction,
      },
    ],
  },
]);
```

```jsx
// loaders
async function productsLoader({ request }) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("q");

  const res = await fetch(`/api/products?category=${category}&q=${search}`);
  if (!res.ok) throw new Response("Failed to load products", { status: 500 });
  return res.json();
}

async function productLoader({ params }) {
  const res = await fetch(`/api/products/${params.productId}`);
  if (res.status === 404) throw new Response("Product not found", { status: 404 });
  return res.json();
}
```

```jsx
// ProductDetail.jsx — using useFetcher for "Add to Cart"
import { useLoaderData, useFetcher } from "react-router";

function ProductDetail() {
  const product = useLoaderData();
  const fetcher = useFetcher();

  const isAdding = fetcher.state === "submitting";

  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <img src={product.image} alt={product.name} />

      <fetcher.Form method="post">
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="intent" value="addToCart" />
        <select name="quantity">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <button disabled={isAdding}>
          {isAdding ? "Adding..." : "Add to Cart 🛒"}
        </button>
      </fetcher.Form>

      {fetcher.data?.success && <p className="success">✅ Added to cart!</p>}
    </div>
  );
}
```

```jsx
// actions
async function addToCartAction({ request, params }) {
  const formData = await request.formData();
  const productId = formData.get("productId");
  const quantity = formData.get("quantity");

  await fetch("/api/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });

  return { success: true };
  // After this, rootLoader re-runs → cart count updates in header!
}
```

---

## ✅ What You'll Learn

1. How to build a **complete Data Router app** with loaders and actions
2. How **`useFetcher`** enables "Add to Cart" without navigation
3. How loaders **automatically revalidate** after actions (cart count updates)
4. How to use `errorElement` for **product-specific error pages**
5. How **search params in loaders** enable server-side filtering
6. The full **production pattern** for e-commerce routing

---

## 🎯 Practice Tasks

- [ ] Add optimistic UI for the "Add to Cart" button
- [ ] Implement cart quantity update with `fetcher.Form`
- [ ] Add product reviews with their own action
- [ ] Implement a checkout flow with address and payment steps
- [ ] Add a "Recently Viewed" section using session storage
