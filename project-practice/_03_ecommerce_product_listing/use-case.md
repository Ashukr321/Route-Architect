# 🎯 Project 03 — E-Commerce Product Listing

## 📊 Difficulty: ⭐⭐ Beginner-Intermediate

---

## 📋 Situation / Use Case

You're building an **e-commerce product listing** where users can browse products by category, search with filters, and the URL reflects the current filters (so they can bookmark or share filtered views).

**Client Requirement**: "Users should be able to filter products by category and search — and when they share the URL, the same filters should be applied for whoever opens the link."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| useSearchParams | [`_07_useSearchParams`](../../_07_useSearchParams) |
| useParams | [`_05_useParams`](../../_05_useParams) |
| useNavigate | [`_04_useNavigate`](../../_04_useNavigate) |
| NavLink (categories) | [`_03_link_and_navlink`](../../_03_link_and_navlink) |
| Dynamic Segments | [`_02_routes_and_route`](../../_02_routes_and_route) |

---

## 🏗️ Project Setup

```bash
npm create vite@latest ecommerce-listing -- --template react
cd ecommerce-listing
npm install react-router
npm run dev
```

---

## 📁 Folder Structure

```
src/
├── App.jsx
├── data/
│   └── products.js
├── pages/
│   ├── ProductList.jsx
│   ├── ProductDetail.jsx
│   └── CategoryPage.jsx
├── components/
│   ├── SearchBar.jsx
│   ├── FilterSidebar.jsx
│   ├── ProductCard.jsx
│   └── Pagination.jsx
└── styles/
```

---

## 🛣️ Routing Approach

```jsx
// App.jsx
import { Routes, Route } from "react-router";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:productId" element={<ProductDetail />} />
      <Route path="/category/:categoryName" element={<CategoryPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

```jsx
// pages/ProductList.jsx — URL-driven filters
import { useSearchParams } from "react-router";

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page")) || 1;
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const handleSearch = (searchTerm) => {
    setSearchParams((prev) => {
      if (searchTerm) prev.set("q", searchTerm);
      else prev.delete("q");
      prev.set("page", "1"); // Reset page on new search
      return prev;
    });
  };

  const handleSort = (sortValue) => {
    setSearchParams((prev) => {
      prev.set("sort", sortValue);
      return prev;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  // Filter products based on URL params
  let filtered = products
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .filter((p) => (!minPrice || p.price >= Number(minPrice)))
    .filter((p) => (!maxPrice || p.price <= Number(maxPrice)));

  // Sort
  if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);

  return (
    <div>
      <SearchBar value={query} onChange={handleSearch} />

      <select value={sort} onChange={(e) => handleSort(e.target.value)}>
        <option value="newest">Newest</option>
        <option value="price-low">Price: Low → High</option>
        <option value="price-high">Price: High → Low</option>
      </select>

      <div className="product-grid">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <Pagination current={page} onChange={handlePageChange} />
    </div>
  );
}

// URL example: /products?q=laptop&sort=price-low&page=2&minPrice=500
```

```jsx
// pages/ProductDetail.jsx
import { useParams, useNavigate, useLocation } from "react-router";

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const product = products.find((p) => p.id === productId);

  return (
    <div>
      <button onClick={() => navigate(-1)}>← Back to Products</button>
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
    </div>
  );
}
```

---

## ✅ What You'll Learn

1. How to use **`useSearchParams`** for URL-based filtering
2. How to **preserve search params** when updating one filter
3. How to build **shareable, bookmarkable** filtered URLs
4. How to reset page to 1 when **search changes**
5. Combining **`useParams`** (product detail) with **`useSearchParams`** (filters)

---

## 🎯 Practice Tasks

- [ ] Add a price range filter that updates the URL
- [ ] Implement pagination with `page` search param
- [ ] Add "Clear All Filters" button that resets all search params
- [ ] Make the back button preserve the user's filter state
