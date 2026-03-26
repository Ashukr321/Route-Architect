# 🎯 Project 20 — Full-Stack Framework Mode App (SSR + SSG + RSC)

## 📊 Difficulty: ⭐⭐⭐⭐⭐ Expert / Production-Grade

---

## 📋 Situation / Use Case

You're building a **full-stack production application** using React Router's **Framework Mode** — the most advanced mode. The app uses server-side rendering (SSR) for dynamic pages, static site generation (SSG) for marketing pages, type-safe routing, and the full Route Module API with loaders, actions, meta tags, headers, and more.

**Client Requirement**: "We need a production-grade platform with: marketing pages (statically rendered), app pages (server-rendered), type-safe routing, SEO optimization via meta tags, optimistic UI for CRUD operations, and API routes. It should be deployable to Vercel/Cloudflare and perform at a level comparable to Next.js."

---

## 🧠 Concepts Used (ALL CONCEPTS!)

| Concept | Folder Reference |
|---------|-----------------|
| Framework Mode | [`_23_framework_mode`](../../_23_framework_mode) |
| createBrowserRouter | [`_11_data_routers`](../../_11_data_routers) |
| loader / clientLoader | [`_12_loader`](../../_12_loader) |
| action / clientAction | [`_13_action`](../../_13_action) |
| useLoaderData | [`_14_useLoaderData`](../../_14_useLoaderData) |
| useActionData | [`_15_useActionData`](../../_15_useActionData) |
| useFetcher | [`_16_useFetcher`](../../_16_useFetcher) |
| useRouteError | [`_19_useRouteError`](../../_19_useRouteError) |
| Error Boundaries | [`_21_error_boundaries`](../../_21_error_boundaries) |
| Protected Routes | [`_20_protected_routes`](../../_20_protected_routes) |
| Lazy Loading | [`_22_lazy_loading_routes`](../../_22_lazy_loading_routes) |
| useParams | [`_05_useParams`](../../_05_useParams) |
| useSearchParams | [`_07_useSearchParams`](../../_07_useSearchParams) |
| useNavigate | [`_04_useNavigate`](../../_04_useNavigate) |
| useLocation | [`_06_useLocation`](../../_06_useLocation) |
| Nested Routes + Outlet | [`_08_outlet_and_nested_routes`](../../_08_outlet_and_nested_routes) |
| NavLink | [`_03_link_and_navlink`](../../_03_link_and_navlink) |
| Navigate | [`_09_navigate_redirect`](../../_09_navigate_redirect) |
| useOutletContext | [`_17_useOutletContext`](../../_17_useOutletContext) |
| useMatch | [`_18_useMatch`](../../_18_useMatch) |

---

## 🏗️ Project Setup

```bash
# Create with Framework Mode
npx -y create-react-router@latest fullstack-app
cd fullstack-app
npm install
npm run dev
```

---

## 📁 Folder Structure

```
app/
├── routes.ts                    # Central route config
├── root.tsx                     # Root layout
├── routes/
│   ├── home.tsx                 # Marketing (SSG)
│   ├── pricing.tsx              # Marketing (SSG)
│   ├── about.tsx                # Marketing (SSG)
│   ├── blog/
│   │   ├── index.tsx            # Blog list (SSR)
│   │   └── $slug.tsx            # Blog post (SSR)
│   ├── auth/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── app/
│   │   ├── layout.tsx           # App layout with sidebar
│   │   ├── dashboard.tsx
│   │   ├── projects/
│   │   │   ├── index.tsx        # List
│   │   │   ├── new.tsx          # Create
│   │   │   └── $projectId.tsx   # Detail + Edit
│   │   ├── settings.tsx
│   │   └── profile.tsx
│   └── api/
│       ├── webhook.tsx
│       └── health.tsx
├── components/
├── lib/
│   ├── db.server.ts             # Server-only database
│   ├── auth.server.ts           # Server-only auth
│   └── utils.ts
└── react-router.config.ts       # SSR/SSG configuration
```

---

## 🛣️ Routing Approach

```ts
// app/routes.ts
import { index, route, layout, prefix } from "@react-router/dev/routes";

export default [
  // Marketing pages (pre-rendered / SSG)
  index("./routes/home.tsx"),
  route("pricing", "./routes/pricing.tsx"),
  route("about", "./routes/about.tsx"),

  // Blog (SSR)
  ...prefix("blog", [
    index("./routes/blog/index.tsx"),
    route(":slug", "./routes/blog/$slug.tsx"),
  ]),

  // Auth
  route("login", "./routes/auth/login.tsx"),
  route("register", "./routes/auth/register.tsx"),

  // App (authenticated, SSR)
  layout("./routes/app/layout.tsx", [
    route("dashboard", "./routes/app/dashboard.tsx"),
    ...prefix("projects", [
      index("./routes/app/projects/index.tsx"),
      route("new", "./routes/app/projects/new.tsx"),
      route(":projectId", "./routes/app/projects/$projectId.tsx"),
    ]),
    route("settings", "./routes/app/settings.tsx"),
    route("profile", "./routes/app/profile.tsx"),
  ]),

  // API routes (server-only)
  route("api/webhook", "./routes/api/webhook.tsx"),
  route("api/health", "./routes/api/health.tsx"),
];
```

```ts
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  async prerender() {
    // Pre-render marketing pages as static HTML
    const blogSlugs = await getBlogSlugs();
    return [
      "/",
      "/pricing",
      "/about",
      ...blogSlugs.map((slug) => `/blog/${slug}`),
    ];
  },
} satisfies Config;
```

```tsx
// app/routes/app/projects/$projectId.tsx — Full Route Module
import type { Route } from "./+types/$projectId";
import { Form, useFetcher, redirect } from "react-router";
import { db } from "~/lib/db.server";
import { requireAuth } from "~/lib/auth.server";

// Server-side loader — type-safe!
export async function loader({ params, request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  const project = await db.project.findUnique({
    where: { id: params.projectId, ownerId: user.id },
  });

  if (!project) throw new Response("Not Found", { status: 404 });
  return { project };
}

// Server-side action
export async function action({ request, params }: Route.ActionArgs) {
  const user = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "update") {
    await db.project.update({
      where: { id: params.projectId, ownerId: user.id },
      data: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
      },
    });
    return { success: true };
  }

  if (intent === "delete") {
    await db.project.delete({
      where: { id: params.projectId, ownerId: user.id },
    });
    return redirect("/projects");
  }

  return { error: "Unknown intent" };
}

// SEO meta tags — type-safe!
export function meta({ data }: Route.MetaArgs) {
  if (!data?.project) {
    return [{ title: "Project Not Found" }];
  }
  return [
    { title: `${data.project.name} | MyApp` },
    { name: "description", content: data.project.description },
    { property: "og:title", content: data.project.name },
  ];
}

// Cache headers
export function headers() {
  return {
    "Cache-Control": "private, max-age=60",
  };
}

// Component — fully type-safe!
export default function ProjectDetail({ loaderData }: Route.ComponentProps) {
  const { project } = loaderData;
  const fetcher = useFetcher();

  return (
    <div>
      <h1>{project.name}</h1>
      <p>{project.description}</p>

      {/* Inline edit with fetcher */}
      <fetcher.Form method="post">
        <input type="hidden" name="intent" value="update" />
        <input name="name" defaultValue={project.name} />
        <textarea name="description" defaultValue={project.description} />
        <button disabled={fetcher.state !== "idle"}>
          {fetcher.state === "submitting" ? "Saving..." : "Save"}
        </button>
      </fetcher.Form>

      {/* Delete */}
      <Form method="post">
        <input type="hidden" name="intent" value="delete" />
        <button
          type="submit"
          onClick={(e) => {
            if (!confirm("Delete this project?")) e.preventDefault();
          }}
        >
          Delete Project
        </button>
      </Form>
    </div>
  );
}

// Error boundary
export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div>
      <h1>Project Error</h1>
      <p>{isRouteErrorResponse(error) ? error.statusText : "Unknown error"}</p>
    </div>
  );
}
```

---

## ✅ What You'll Learn

1. How **Framework Mode** combines all routing features into one cohesive system
2. How to build **full-stack routes** with server loaders, actions, and meta
3. How to mix **SSR** (dynamic) and **SSG** (static) rendering strategies
4. How **type-safe params and loader data** prevent bugs
5. How to build **API routes** alongside page routes
6. How to use **server-only code** (`.server.ts` files) safely
7. How **every React Router concept** fits together in production
8. The **architecture used by the biggest React applications** in production

---

## 🎯 Practice Tasks

- [ ] Add social media preview (Open Graph) meta tags per page
- [ ] Implement streaming SSR with Suspense boundaries
- [ ] Add a `shouldRevalidate` to optimize revalidation
- [ ] Create client-only loaders (`clientLoader`) for non-critical data
- [ ] Deploy to Vercel/Cloudflare and configure caching headers
- [ ] Add progressive enhancement — forms should work without JavaScript

---

## 🏆 Congratulations!

If you've completed all 20 projects, you now have mastery over:

- ✅ Basic routing & navigation
- ✅ Dynamic routes & URL parameters
- ✅ Nested layouts & outlets
- ✅ Protected routes & authentication
- ✅ Data loading with loaders & actions
- ✅ URL-driven state management (search params)
- ✅ Error boundaries & error handling
- ✅ Lazy loading & code splitting
- ✅ Multi-tenant & role-based routing
- ✅ Micro-frontend architecture
- ✅ Full-stack framework mode (SSR/SSG)

**You are now a React Router PRO! 🚀**
