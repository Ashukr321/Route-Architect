# 📌 23 - Framework Mode & RSC Conventions

## 🔗 Official Docs
- [Framework Mode](https://reactrouter.com/start/framework/installation)
- [Picking a Mode](https://reactrouter.com/start/modes)

---

## 📖 What is Framework Mode?

Framework Mode wraps Data Mode with a **Vite plugin** to provide the full React Router experience. It includes:
- Type-safe `href`
- Type-safe Route Module API
- Intelligent code splitting
- SPA, SSR, and static rendering strategies
- File-based conventions

---

## 1️⃣ Framework Mode Setup

```bash
npx -y create-react-router@latest my-app
cd my-app
npm install
npm run dev
```

---

## 2️⃣ Route Configuration (routes.ts)

```ts
// app/routes.ts
import { index, route, layout, prefix } from "@react-router/dev/routes";

export default [
  // Index route (home page)
  index("./home.tsx"),

  // Simple route
  route("about", "./about.tsx"),

  // Route with params
  route("products/:pid", "./product.tsx"),

  // Nested routes with layout
  layout("./dashboard/layout.tsx", [
    index("./dashboard/home.tsx"),
    route("settings", "./dashboard/settings.tsx"),
    route("profile", "./dashboard/profile.tsx"),
  ]),

  // Route prefix (no layout)
  ...prefix("api", [
    route("users", "./api/users.tsx"),
    route("posts", "./api/posts.tsx"),
  ]),
];
```

---

## 3️⃣ Route Module API

Each route file can export specific functions that React Router automatically calls:

```tsx
// app/routes/product.tsx
import type { Route } from "./+types/product";

// 🔄 Loader — fetches data before render
export async function loader({ params }: Route.LoaderArgs) {
  const product = await getProduct(params.pid);
  return { product };
}

// 📝 Action — handles form submissions
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  await updateProduct(formData);
  return { success: true };
}

// 🎨 Component — the page UI
export default function Product({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;
  return <h1>{product.name}</h1>;
}

// ⚠️ Error Boundary
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <div>Error: {error.message}</div>;
}

// 📊 Meta tags
export function meta({ data }: Route.MetaArgs) {
  return [
    { title: data.product.name },
    { name: "description", content: data.product.description },
  ];
}

// 🔗 Links (preload assets)
export function links() {
  return [
    { rel: "stylesheet", href: "/product-styles.css" },
  ];
}

// 📋 Headers
export function headers() {
  return {
    "Cache-Control": "max-age=300",
  };
}
```

---

## 4️⃣ Route Module Exports Summary

| Export | Purpose | Runs On |
|--------|---------|---------|
| `loader` | Fetch data | Server (SSR) or Client |
| `clientLoader` | Client-only data | Client only |
| `action` | Handle mutations | Server (SSR) or Client |
| `clientAction` | Client-only mutations | Client only |
| `default` | Page component | Client |
| `ErrorBoundary` | Error UI | Client |
| `meta` | SEO meta tags | Server + Client |
| `links` | Link tags | Server + Client |
| `headers` | Response headers | Server only |
| `handle` | Custom route data | Client |
| `shouldRevalidate` | Control revalidation | Client |

---

## 5️⃣ Type Safety (Generated Types)

```tsx
// Types are automatically generated at ./+types/[filename]
import type { Route } from "./+types/product";

// params are typed based on route path!
export async function loader({ params }: Route.LoaderArgs) {
  params.pid; // ✅ TypeScript knows this exists
  params.foo; // ❌ TypeScript error — not in route path
}

// loaderData is typed based on loader return!
export default function Product({ loaderData }: Route.ComponentProps) {
  loaderData.product; // ✅ Typed correctly
}
```

---

## 6️⃣ Rendering Strategies

```ts
// react-router.config.ts

// SPA Mode (Single Page Application)
export default {
  ssr: false,
};

// SSR Mode (Server-Side Rendering)
export default {
  ssr: true,
};

// Static Pre-rendering
export default {
  async prerender() {
    return ["/", "/about", "/contact"];
  },
};
```

---

## 7️⃣ React Server Components (RSC) — Experimental

```tsx
// Server Component (no "use client" directive)
export default async function Products() {
  const products = await db.products.findMany();

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
```

> ⚠️ RSC support in React Router is **experimental** and evolving.

---

## 📊 Three Modes Comparison

| Feature | Declarative | Data | Framework |
|---------|:-----------:|:----:|:---------:|
| `<BrowserRouter>` | ✅ | ❌ | ❌ |
| `createBrowserRouter` | ❌ | ✅ | ✅ (built-in) |
| Loaders/Actions | ❌ | ✅ | ✅ |
| Type-safe params | ❌ | ❌ | ✅ |
| Code splitting | Manual | Manual | ✅ Auto |
| SSR/SSG | ❌ | ❌ | ✅ |
| Vite plugin | ❌ | ❌ | ✅ |
| File conventions | ❌ | ❌ | ✅ |
| Meta/Links | ❌ | ❌ | ✅ |

---

## 🧠 Key Points to Remember

1. Framework Mode = **Data Mode + Vite Plugin** + conventions
2. Use `routes.ts` for **centralized route configuration**
3. Route Module API gives you `loader`, `action`, `meta`, `links`, `headers`, etc.
4. **Auto-generated types** make params and loader data type-safe
5. Supports **SPA, SSR, and SSG** rendering strategies
6. RSC support is **experimental** — keep an eye on React Router releases
7. If starting fresh, **Framework Mode** is the recommended approach
