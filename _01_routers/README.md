# 📌 01 - Routers (BrowserRouter, HashRouter, MemoryRouter)

## 🔗 Official Docs
- [BrowserRouter](https://reactrouter.com/start/declarative/installation)
- [Picking a Mode](https://reactrouter.com/start/modes)

---

## 📖 What are Routers?

Routers are the **top-level components** that provide the routing context to your entire application. Every React Router app needs to be wrapped in a Router component.

React Router provides **3 main routers** for the declarative mode:

---

## 1️⃣ BrowserRouter (Most Commonly Used)

Uses the **HTML5 History API** (`pushState`, `replaceState`, `popstate`) to keep your UI in sync with the URL.

### ✅ When to use:
- Web applications deployed on a server that handles all routes
- When you want **clean URLs** like `/about`, `/dashboard`

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

### 🌐 URL Example:
```
https://example.com/about
https://example.com/dashboard/settings
```

---

## 2️⃣ HashRouter

Uses the **hash portion** of the URL (`window.location.hash`) to keep UI in sync with URL.

### ✅ When to use:
- When you **cannot configure the server** to handle all routes
- Static file hosting (like GitHub Pages)
- Legacy browser support

```jsx
import { HashRouter, Routes, Route } from "react-router";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </HashRouter>
  );
}
```

### 🌐 URL Example:
```
https://example.com/#/about
https://example.com/#/dashboard/settings
```

---

## 3️⃣ MemoryRouter

Keeps the history of your "URL" in **memory** (does not read or write to the address bar).

### ✅ When to use:
- **Testing** environments
- **Non-browser environments** (React Native)
- When you don't want the URL to change

```jsx
import { MemoryRouter, Routes, Route } from "react-router";

function App() {
  return (
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </MemoryRouter>
  );
}
```

---

## 📊 Comparison Table

| Feature | BrowserRouter | HashRouter | MemoryRouter |
|---------|:------------:|:----------:|:------------:|
| Clean URLs | ✅ | ❌ (has `#`) | N/A |
| Server config needed | ✅ | ❌ | ❌ |
| SEO Friendly | ✅ | ❌ | ❌ |
| Works with static hosting | ❌ | ✅ | N/A |
| Good for testing | ⚠️ | ⚠️ | ✅ |
| Shows in address bar | ✅ | ✅ | ❌ |

---

## 🧠 Key Points to Remember

1. **Always wrap your app** with one of these routers at the top level
2. **BrowserRouter** is the default choice for most web apps
3. **HashRouter** is a fallback when server-side routing isn't available
4. **MemoryRouter** is mainly for testing and non-browser environments
5. You can only use **one router** per application
6. All routing components (`<Route>`, `<Link>`, etc.) must be **descendants** of a router
