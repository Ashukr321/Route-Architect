# 🎯 Project 15 — Multi-Tenant SaaS with Lazy Loading

## 📊 Difficulty: ⭐⭐⭐⭐ Advanced

---

## 📋 Situation / Use Case

You're building a **multi-tenant SaaS application** where each organization has its own subdomain-like URL prefix (`/org/acme/dashboard`). Routes are lazy-loaded for performance, and each tenant can have custom feature flags.

**Client Requirement**: "Each organization should have isolated routes like `/org/:orgSlug/...`. Lazy load all major pages. Support feature flags that enable/disable routes per tenant. An org admin should manage members and billing."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| Lazy Loading (`lazy`) | [`_22_lazy_loading_routes`](../../_22_lazy_loading_routes) |
| createBrowserRouter | [`_11_data_routers`](../../_11_data_routers) |
| loader (tenant data) | [`_12_loader`](../../_12_loader) |
| useParams (orgSlug) | [`_05_useParams`](../../_05_useParams) |
| useRouteLoaderData | [`_14_useLoaderData`](../../_14_useLoaderData) |
| Protected Routes | [`_20_protected_routes`](../../_20_protected_routes) |
| Error Boundaries | [`_21_error_boundaries`](../../_21_error_boundaries) |
| useRouteError | [`_19_useRouteError`](../../_19_useRouteError) |

---

## 🛣️ Routing Approach

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, lazy: () => import("./pages/Landing") },
      { path: "login", lazy: () => import("./pages/Login") },
      { path: "register", lazy: () => import("./pages/Register") },
      { path: "pricing", lazy: () => import("./pages/Pricing") },
    ],
  },
  {
    id: "org",
    path: "/org/:orgSlug",
    lazy: () => import("./layouts/OrgLayout"),
    loader: orgLoader, // Validates org exists, loads features
    errorElement: <OrgNotFound />,
    children: [
      {
        index: true,
        lazy: () => import("./pages/org/Dashboard"),
      },
      {
        path: "projects",
        lazy: () => import("./pages/org/Projects"),
      },
      {
        path: "projects/:projectId",
        lazy: () => import("./pages/org/ProjectDetail"),
      },
      {
        path: "team",
        lazy: () => import("./pages/org/Team"),
      },
      {
        path: "analytics",
        lazy: () => import("./pages/org/Analytics"),
        // Feature-flagged! Loader checks if enabled
        loader: featureGatedLoader("analytics"),
      },
      {
        path: "billing",
        lazy: () => import("./pages/org/Billing"),
        loader: featureGatedLoader("billing"),
      },
      {
        path: "settings",
        lazy: () => import("./pages/org/Settings"),
        children: [
          { path: "general", lazy: () => import("./pages/org/settings/General") },
          { path: "members", lazy: () => import("./pages/org/settings/Members") },
          { path: "integrations", lazy: () => import("./pages/org/settings/Integrations") },
        ],
      },
    ],
  },
]);
```

```jsx
// Org loader — validates tenant and loads feature flags
async function orgLoader({ params }) {
  const org = await api.getOrganization(params.orgSlug);
  if (!org) throw new Response("Organization not found", { status: 404 });
  return { org, features: org.featureFlags };
}

// Feature-gated loader factory
function featureGatedLoader(featureName) {
  return async ({ params }) => {
    const org = await api.getOrganization(params.orgSlug);
    if (!org.featureFlags[featureName]) {
      throw new Response(`Feature "${featureName}" is not enabled`, { status: 403 });
    }
    return null; // Let the lazy loader handle data
  };
}

// Any child can access org data
function TeamPage() {
  const { org } = useRouteLoaderData("org");
  return <h1>Team at {org.name}</h1>;
}
```

```jsx
// pages/org/Dashboard.jsx — lazy loaded module
export function Component() {
  const { orgSlug } = useParams();
  const { org } = useRouteLoaderData("org");

  return <div>Welcome to {org.name} Dashboard</div>;
}

export async function loader({ params }) {
  return fetch(`/api/orgs/${params.orgSlug}/dashboard`);
}
```

---

## ✅ What You'll Learn

1. How to implement **multi-tenant routing** with org-scoped URLs
2. How **`lazy` routes** split code per page for performance
3. How to use **`useRouteLoaderData("id")`** to access parent data anywhere
4. How to build **feature-gated routes** with loader validation
5. How lazy routes export **`Component`** and **`loader`** as named exports
6. Production-level **SaaS routing architecture**

---

## 🎯 Practice Tasks

- [ ] Add org switching (dropdown that navigates to `/org/:newOrg/dashboard`)
- [ ] Implement a global loading indicator for lazy routes
- [ ] Add preloading on sidebar hover for better perceived performance
- [ ] Handle expired subscription → redirect to billing page
- [ ] Add org invite flow with token-based route (`/org/:slug/invite/:token`)
