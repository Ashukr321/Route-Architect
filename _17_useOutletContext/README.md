# 📌 17 - useOutletContext Hook

## 🔗 Official Docs
- [Outlet Context](https://reactrouter.com/start/library/routing)

---

## 📖 What is useOutletContext?

`useOutletContext` allows **child routes** to access data passed from a **parent route** through the `<Outlet context>` prop. It's like a scoped Context API for routes.

---

## 1️⃣ Basic Usage

### Parent Route:
```jsx
import { Outlet } from "react-router";

function DashboardLayout() {
  const [user] = useState({ name: "Ashutosh", role: "admin" });
  const [theme, setTheme] = useState("dark");

  return (
    <div className={`dashboard ${theme}`}>
      <h1>Dashboard</h1>
      {/* Pass data to child routes */}
      <Outlet context={{ user, theme, setTheme }} />
    </div>
  );
}
```

### Child Route:
```jsx
import { useOutletContext } from "react-router";

function Profile() {
  const { user, theme } = useOutletContext();

  return (
    <div>
      <h2>Hello, {user.name}!</h2>
      <p>Current theme: {theme}</p>
    </div>
  );
}
```

---

## 2️⃣ Sharing Authentication Data

```jsx
// Parent Layout
function AppLayout() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials) => {
    const userData = await authenticateUser(credentials);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <div>
      <Header user={user} />
      <Outlet context={{ user, isAuthenticated, login, logout }} />
      <Footer />
    </div>
  );
}

// Child: Settings Page
function Settings() {
  const { user, logout } = useOutletContext();

  return (
    <div>
      <h2>Settings for {user.name}</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 3️⃣ Shared State Between Sibling Routes

```jsx
// Parent
function ShopLayout() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <div>
      <nav>Cart items: {cart.length}</nav>
      <Outlet context={{ cart, addToCart, removeFromCart }} />
    </div>
  );
}

// Child: Products Page
function Products() {
  const { addToCart } = useOutletContext();

  return (
    <div>
      {products.map((p) => (
        <button key={p.id} onClick={() => addToCart(p)}>
          Add {p.name} to Cart
        </button>
      ))}
    </div>
  );
}

// Child: Cart Page
function Cart() {
  const { cart, removeFromCart } = useOutletContext();

  return (
    <ul>
      {cart.map((item) => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## 4️⃣ TypeScript Usage

```tsx
type DashboardContext = {
  user: { name: string; role: string };
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
};

// Parent
function DashboardLayout() {
  const context: DashboardContext = {
    user: { name: "Ashutosh", role: "admin" },
    theme: "dark",
    setTheme: () => {},
  };

  return <Outlet context={context} />;
}

// Child with typed context
function Settings() {
  const { user, theme, setTheme } = useOutletContext<DashboardContext>();
  return <p>{user.name} - {theme}</p>;
}
```

---

## 📊 useOutletContext vs React Context API

| Feature | useOutletContext | React Context (useContext) |
|---------|:---------------:|:-------------------------:|
| Scope | Route hierarchy only | Any component tree |
| Setup | Just pass `context` prop | Create Provider + Consumer |
| Simplicity | ✅ Very simple | ⚠️ More boilerplate |
| Re-renders | Only child routes | All consumers |
| Best for | Route-specific data | Global app state |

---

## 🧠 Key Points to Remember

1. Pass data via `<Outlet context={{...}} />`
2. Access data via `useOutletContext()` in child route components
3. Great for **sharing state** between parent and child routes
4. Simpler than Context API when data is **route-scoped**
5. Works with both **Declarative** and **Data** mode routers
6. Can pass **functions** (like setters) to allow child routes to update parent state
