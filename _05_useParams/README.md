# 📌 05 - useParams Hook

## 🔗 Official Docs
- [Dynamic Segments](https://reactrouter.com/start/library/routing#dynamic-segments)

---

## 📖 What is useParams?

`useParams` returns an **object of key/value pairs** of the dynamic parameters from the current URL that were matched by the `<Route path>`.

---

## 1️⃣ Basic Usage

### Route Definition:
```jsx
<Route path="/users/:userId" element={<UserProfile />} />
```

### Component:
```jsx
import { useParams } from "react-router";

function UserProfile() {
  const { userId } = useParams();
  
  return <h1>User ID: {userId}</h1>;
}

// URL: /users/42 → userId = "42"
```

---

## 2️⃣ Multiple Parameters

### Route Definition:
```jsx
<Route path="/c/:categoryId/p/:productId" element={<Product />} />
```

### Component:
```jsx
import { useParams } from "react-router";

function Product() {
  const { categoryId, productId } = useParams();
  
  return (
    <div>
      <h1>Category: {categoryId}</h1>
      <h2>Product: {productId}</h2>
    </div>
  );
}

// URL: /c/electronics/p/laptop-123
// categoryId = "electronics", productId = "laptop-123"
```

---

## 3️⃣ With Data Fetching

```jsx
import { useParams } from "react-router";
import { useState, useEffect } from "react";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [productId]);

  if (!product) return <p>Loading...</p>;
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
    </div>
  );
}
```

---

## 4️⃣ Splat Parameters

```jsx
<Route path="files/*" element={<FileViewer />} />
```

```jsx
import { useParams } from "react-router";

function FileViewer() {
  const { "*": filePath } = useParams();
  
  return <p>Viewing file: {filePath}</p>;
}

// URL: /files/docs/readme.md → filePath = "docs/readme.md"
```

---

## 5️⃣ Nested Routes with Params

```jsx
<Routes>
  <Route path="/blog/:slug" element={<BlogPost />}>
    <Route path="comments/:commentId" element={<Comment />} />
  </Route>
</Routes>
```

```jsx
// In Comment component — has access to BOTH params
function Comment() {
  const { slug, commentId } = useParams();
  
  return (
    <div>
      <p>Blog: {slug}</p>
      <p>Comment: {commentId}</p>
    </div>
  );
}
```

---

## ⚠️ Important Notes

### Params are always strings:
```jsx
const { userId } = useParams();
console.log(typeof userId); // "string"

// Convert to number if needed
const numericId = Number(userId);
```

### Optional Parameters:
```jsx
<Route path=":lang?/categories" element={<Categories />} />
```

```jsx
function Categories() {
  const { lang } = useParams();
  // URL: /categories → lang = undefined
  // URL: /en/categories → lang = "en"
}
```

---

## 🧠 Key Points to Remember

1. `useParams` returns an **object** with param names as keys
2. All param values are **strings** — convert manually if needed
3. Child routes have access to **all parent route params**
4. Use `*` (splat) to capture **remaining URL segments**
5. Optional params return `undefined` when not present
6. Param names must be **unique** within a route path
