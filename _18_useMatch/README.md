# 📌 18 - useMatch Hook

## 🔗 Official Docs
- [useMatch](https://reactrouter.com/start/library/url-values)

---

## 📖 What is useMatch?

`useMatch` takes a route path pattern and returns a **match object** if the current URL matches the pattern, or `null` if it doesn't. Useful for conditional rendering based on the current route.

---

## 1️⃣ Basic Usage

```jsx
import { useMatch } from "react-router";

function Header() {
  const homeMatch = useMatch("/");
  const aboutMatch = useMatch("/about");

  return (
    <header>
      <h1>My App</h1>
      {homeMatch && <p>You're on the home page!</p>}
      {aboutMatch && <p>You're on the about page!</p>}
    </header>
  );
}
```

---

## 2️⃣ Match Object Structure

```jsx
const match = useMatch("/users/:userId");

// If URL is /users/42:
console.log(match);
// {
//   params: { userId: "42" },
//   pathname: "/users/42",
//   pathnameBase: "/users/42",
//   pattern: { path: "/users/:userId", caseSensitive: false, end: true }
// }

// If URL is /about:
console.log(match); // null
```

---

## 3️⃣ Conditional Rendering

```jsx
function Sidebar() {
  const isDashboard = useMatch("/dashboard/*");

  if (!isDashboard) return null;

  return (
    <aside>
      <h3>Dashboard Menu</h3>
      <nav>
        <NavLink to="/dashboard">Overview</NavLink>
        <NavLink to="/dashboard/analytics">Analytics</NavLink>
        <NavLink to="/dashboard/settings">Settings</NavLink>
      </nav>
    </aside>
  );
}
```

---

## 4️⃣ With Dynamic Segments

```jsx
function Breadcrumb() {
  const userMatch = useMatch("/users/:userId");
  const productMatch = useMatch("/products/:productId");

  return (
    <nav className="breadcrumb">
      <span>Home</span>
      {userMatch && <span> / Users / {userMatch.params.userId}</span>}
      {productMatch && <span> / Products / {productMatch.params.productId}</span>}
    </nav>
  );
}
```

---

## 5️⃣ Active Tab Indicator

```jsx
function TabNavigation() {
  const tabs = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/analytics", label: "Analytics" },
    { path: "/settings", label: "Settings" },
  ];

  return (
    <div className="tabs">
      {tabs.map((tab) => {
        const match = useMatch(`${tab.path}/*`);
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={match ? "tab active" : "tab"}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
```

> 💡 **Note**: For most active-state needs, `<NavLink>` is simpler. Use `useMatch` for more advanced conditional logic.

---

## 📊 useMatch vs NavLink active state

| Feature | `useMatch` | `<NavLink>` |
|---------|:----------:|:-----------:|
| Returns match info | ✅ | ❌ |
| Access to params | ✅ | ❌ |
| Conditional rendering | ✅ | ⚠️ Limited |
| Active CSS class | Manual | ✅ Automatic |
| Simplicity for nav | ❌ More code | ✅ Simple |

---

## 🧠 Key Points to Remember

1. `useMatch` returns a **match object** or `null`
2. Match object contains `params`, `pathname`, and `pattern`
3. Use `/*` pattern to match **all child routes** under a path
4. For simple active-state styling, **prefer `<NavLink>`**
5. Use `useMatch` when you need **conditional logic** beyond just styling
6. Can match **dynamic segments** and access their values
