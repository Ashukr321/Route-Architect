# 📌 03 - Link & NavLink (Navigation Components)

## 🔗 Official Docs
- [Navigating](https://reactrouter.com/start/library/navigating)

---

## 📖 Overview

`<Link>` and `<NavLink>` are the primary **navigation components** in React Router. They render accessible `<a>` elements that navigate without full page reloads.

---

## 1️⃣ Link Component

Use `<Link>` for **basic navigation** without active styling needs.

```jsx
import { Link } from "react-router";

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact Us</Link>
    </nav>
  );
}
```

### Link Props:

| Prop | Type | Description |
|------|------|-------------|
| `to` | string \| object | Destination path |
| `replace` | boolean | Replace current entry in history |
| `state` | any | Pass state data to the destination |
| `preventScrollReset` | boolean | Prevent scroll position reset |

### Link with State:
```jsx
<Link to="/profile" state={{ from: "dashboard" }}>
  Go to Profile
</Link>

// In the Profile component, access state:
import { useLocation } from "react-router";

function Profile() {
  const location = useLocation();
  console.log(location.state); // { from: "dashboard" }
}
```

### Link with Replace:
```jsx
{/* Replaces current history entry instead of pushing */}
<Link to="/login" replace>
  Login
</Link>
```

---

## 2️⃣ NavLink Component

Use `<NavLink>` when you need **active state styling** — it knows whether it's "active" or "pending".

### Basic Usage:
```jsx
import { NavLink } from "react-router";

function Sidebar() {
  return (
    <nav>
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/settings">Settings</NavLink>
    </nav>
  );
}
```

> 💡 NavLink automatically gets an `.active` CSS class when active!

### CSS Styling:
```css
/* Simple active styling */
a.active {
  color: red;
  font-weight: bold;
}
```

### Dynamic className:
```jsx
<NavLink
  to="/messages"
  className={({ isActive, isPending }) =>
    isActive ? "text-active" : isPending ? "text-pending" : ""
  }
>
  Messages
</NavLink>
```

### Dynamic style:
```jsx
<NavLink
  to="/messages"
  style={({ isActive }) => ({
    color: isActive ? "red" : "black",
    fontWeight: isActive ? "bold" : "normal",
  })}
>
  Messages
</NavLink>
```

### Render Props (children):
```jsx
<NavLink to="/tasks">
  {({ isActive }) => (
    <span className={isActive ? "active" : ""}>
      {isActive ? "👉 " : ""}Tasks
    </span>
  )}
</NavLink>
```

---

## 3️⃣ The `end` Prop

By default, NavLink is active when any **descendant** URL is matched. Use `end` to match **only** the exact path.

```jsx
{/* Without end: active for "/" AND "/dashboard" and all sub-routes */}
<NavLink to="/">Home</NavLink>

{/* With end: active ONLY for "/" */}
<NavLink to="/" end>Home</NavLink>
```

---

## 4️⃣ Link vs NavLink

| Feature | Link | NavLink |
|---------|:----:|:-------:|
| Basic navigation | ✅ | ✅ |
| Active class (`.active`) | ❌ | ✅ |
| `isActive` callback | ❌ | ✅ |
| `isPending` callback | ❌ | ✅ |
| `end` prop | ❌ | ✅ |
| `className` as function | ❌ | ✅ |
| `style` as function | ❌ | ✅ |

---

## 5️⃣ Link `to` Prop Formats

```jsx
{/* String path */}
<Link to="/about">About</Link>

{/* Relative path */}
<Link to="details">Details</Link>

{/* With query string */}
<Link to="/search?q=react">Search</Link>

{/* With hash */}
<Link to="/docs#section-1">Go to Section 1</Link>

{/* Object format */}
<Link
  to={{
    pathname: "/search",
    search: "?q=react",
    hash: "#results",
  }}
>
  Search React
</Link>
```

---

## 🧠 Key Points to Remember

1. **Never use `<a>` tags** for internal navigation — always use `<Link>` or `<NavLink>`
2. `<Link>` is for **simple navigation**, `<NavLink>` is for **navigation with active states**
3. NavLink automatically adds `.active` class — no extra code needed
4. Use the `end` prop on NavLink to **prevent parent routes** from being active
5. Use `state` prop to **pass data** between routes without URL changes
6. Use `replace` prop to **replace** history instead of pushing
