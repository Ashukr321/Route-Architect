# 📌 07 - useSearchParams Hook

## 🔗 Official Docs
- [useSearchParams](https://reactrouter.com/start/library/url-values)

---

## 📖 What is useSearchParams?

`useSearchParams` is used to **read and modify** the query string (search parameters) of the current URL. It works like `useState` but for URL search params.

---

## 1️⃣ Basic Usage — Reading Search Params

```jsx
import { useSearchParams } from "react-router";

function SearchPage() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q");
  const page = searchParams.get("page");

  return (
    <div>
      <p>Search: {query}</p>
      <p>Page: {page || 1}</p>
    </div>
  );
}

// URL: /search?q=react&page=2
// query = "react", page = "2"
```

---

## 2️⃣ Setting Search Params

```jsx
import { useSearchParams } from "react-router";

function FilterPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilter = (category) => {
    setSearchParams({ category, page: "1" });
    // URL becomes: /products?category=electronics&page=1
  };

  return (
    <div>
      <button onClick={() => handleFilter("electronics")}>Electronics</button>
      <button onClick={() => handleFilter("books")}>Books</button>
      <p>Current filter: {searchParams.get("category")}</p>
    </div>
  );
}
```

---

## 3️⃣ Updating Individual Params (Preserving Others)

```jsx
import { useSearchParams } from "react-router";

function Pagination() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
    // Only updates "page", keeps other params intact
  };

  const currentPage = Number(searchParams.get("page")) || 1;

  return (
    <div>
      <p>Page: {currentPage}</p>
      <button onClick={() => handlePageChange(currentPage - 1)}>Prev</button>
      <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
    </div>
  );
}
```

---

## 4️⃣ Removing a Search Param

```jsx
const [searchParams, setSearchParams] = useSearchParams();

const clearFilter = () => {
  setSearchParams((prev) => {
    prev.delete("category");
    return prev;
  });
};
```

---

## 5️⃣ Default Search Params

```jsx
import { useSearchParams } from "react-router";

function ProductList() {
  // Set default values
  const [searchParams, setSearchParams] = useSearchParams({
    sort: "newest",
    page: "1",
  });

  const sort = searchParams.get("sort");
  const page = searchParams.get("page");

  return (
    <div>
      <p>Sort: {sort}</p>
      <p>Page: {page}</p>
    </div>
  );
}
```

---

## 6️⃣ Multiple Values for Same Key

```jsx
// URL: /products?color=red&color=blue
const [searchParams] = useSearchParams();

// Get single value
searchParams.get("color");    // "red" (first one)

// Get ALL values
searchParams.getAll("color"); // ["red", "blue"]
```

---

## 7️⃣ Complete Search + Filter Example

```jsx
import { useSearchParams } from "react-router";

function ProductSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams((prev) => {
      if (inputValue) {
        prev.set("q", inputValue);
      } else {
        prev.delete("q");
      }
      prev.set("page", "1"); // Reset to page 1 on new search
      return prev;
    });
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search products..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

---

## 📊 SearchParams Methods

| Method | Description | Example |
|--------|-------------|---------|
| `.get(key)` | Get first value | `searchParams.get("q")` |
| `.getAll(key)` | Get all values | `searchParams.getAll("color")` |
| `.has(key)` | Check if key exists | `searchParams.has("page")` |
| `.set(key, value)` | Set/update a param | `params.set("page", "2")` |
| `.delete(key)` | Remove a param | `params.delete("filter")` |
| `.append(key, value)` | Add another value | `params.append("tag", "new")` |
| `.toString()` | Get as string | `"q=react&page=1"` |
| `.entries()` | Iterator of [key, value] | `for (let [k, v] of params)` |

---

## 🧠 Key Points to Remember

1. `useSearchParams` is like `useState` but for **URL query strings**
2. Returns `[searchParams, setSearchParams]` — similar to `useState`
3. Use the **callback form** of `setSearchParams` to preserve existing params
4. All values are **strings** — convert numbers manually
5. Changes are reflected in the **browser URL** immediately
6. Great for **search**, **filters**, **pagination**, and **sorting**
