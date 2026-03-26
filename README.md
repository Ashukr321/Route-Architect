# 🛣️ Route-Architect — React Router DOM Complete Learning Guide

> A comprehensive, structured guide to mastering **React Router DOM v7** — from basics to advanced concepts.

📖 **Official Docs**: [https://reactrouter.com/home](https://reactrouter.com/home)

---

## 📂 Folder Structure

All topics are organized in numbered folders starting from the **most commonly used** concepts, progressing to advanced topics.

---

### 🟢 Core Concepts (Most Used — Start Here!)

| # | Folder | Topic | Key APIs |
|---|--------|-------|----------|
| 01 | [`_01_routers`](./_01_routers) | **Routers** | `BrowserRouter`, `HashRouter`, `MemoryRouter` |
| 02 | [`_02_routes_and_route`](./_02_routes_and_route) | **Routes & Route** | `<Routes>`, `<Route>`, Dynamic Segments, Splats |
| 03 | [`_03_link_and_navlink`](./_03_link_and_navlink) | **Link & NavLink** | `<Link>`, `<NavLink>`, Active States |
| 04 | [`_04_useNavigate`](./_04_useNavigate) | **useNavigate Hook** | Programmatic Navigation, History |
| 05 | [`_05_useParams`](./_05_useParams) | **useParams Hook** | URL Parameters, Dynamic Segments |
| 06 | [`_06_useLocation`](./_06_useLocation) | **useLocation Hook** | Current URL Info, State, Analytics |
| 07 | [`_07_useSearchParams`](./_07_useSearchParams) | **useSearchParams Hook** | Query Strings, Filters, Pagination |
| 08 | [`_08_outlet_and_nested_routes`](./_08_outlet_and_nested_routes) | **Outlet & Nested Routes** | `<Outlet>`, Layout Routes, Nesting |
| 09 | [`_09_navigate_redirect`](./_09_navigate_redirect) | **Navigate Component** | `<Navigate>`, Declarative Redirects |
| 10 | [`_10_useRoutes`](./_10_useRoutes) | **useRoutes Hook** | Object-based Route Config |

---

### 🔵 Data Mode APIs

| # | Folder | Topic | Key APIs |
|---|--------|-------|----------|
| 11 | [`_11_data_routers`](./_11_data_routers) | **Data Routers** | `createBrowserRouter`, `RouterProvider` |
| 12 | [`_12_loader`](./_12_loader) | **Loaders** | `loader`, Data Fetching Before Render |
| 13 | [`_13_action`](./_13_action) | **Actions** | `action`, `<Form>`, Data Mutations |
| 14 | [`_14_useLoaderData`](./_14_useLoaderData) | **useLoaderData Hook** | Access Pre-loaded Data |
| 15 | [`_15_useActionData`](./_15_useActionData) | **useActionData Hook** | Validation Errors, Action Results |
| 16 | [`_16_useFetcher`](./_16_useFetcher) | **useFetcher Hook** | Non-navigating Data Interactions |

---

### 🟣 Advanced Hooks

| # | Folder | Topic | Key APIs |
|---|--------|-------|----------|
| 17 | [`_17_useOutletContext`](./_17_useOutletContext) | **useOutletContext Hook** | Share Data Between Routes |
| 18 | [`_18_useMatch`](./_18_useMatch) | **useMatch Hook** | URL Pattern Matching |
| 19 | [`_19_useRouteError`](./_19_useRouteError) | **useRouteError Hook** | Error Handling in Data Routers |

---

### 🔴 Route Protection & Patterns

| # | Folder | Topic | Key APIs |
|---|--------|-------|----------|
| 20 | [`_20_protected_routes`](./_20_protected_routes) | **Protected Routes** | Auth Guards, Role-Based Access |
| 21 | [`_21_error_boundaries`](./_21_error_boundaries) | **Error Boundaries** | `errorElement`, 404 Pages |
| 22 | [`_22_lazy_loading_routes`](./_22_lazy_loading_routes) | **Lazy Loading** | Code Splitting, `React.lazy`, `lazy` |

---

### 🟡 Framework Mode & RSC

| # | Folder | Topic | Key APIs |
|---|--------|-------|----------|
| 23 | [`_23_framework_mode`](./_23_framework_mode) | **Framework Mode** | Route Module API, SSR/SSG, RSC |

---

## 🎯 React Router Modes Overview

React Router v7 supports **3 modes**:

```
┌──────────────────────────────────────────────────────────────┐
│                    React Router v7 Modes                      │
├──────────────┬──────────────────┬────────────────────────────┤
│  Declarative │     Data         │     Framework              │
│  (Simple)    │  (Powerful)      │  (Full Featured)           │
├──────────────┼──────────────────┼────────────────────────────┤
│ BrowserRouter│ createBrowser    │ Vite Plugin +              │
│ <Routes>     │ Router           │ createBrowserRouter        │
│ <Route>      │ RouterProvider   │ routes.ts                  │
│ <Link>       │ loader / action  │ Type-safe Route Module API │
│ useNavigate  │ useFetcher       │ SSR / SSG / SPA            │
│ useParams    │ errorElement     │ Auto Code Splitting        │
│ useLocation  │ lazy loading     │ Meta / Links / Headers     │
└──────────────┴──────────────────┴────────────────────────────┘
```

---

## 🚀 Most Used Hooks Quick Reference

| Hook | Purpose | Mode |
|------|---------|------|
| `useNavigate` | Programmatic navigation | All |
| `useParams` | URL parameters | All |
| `useLocation` | Current URL info | All |
| `useSearchParams` | Query string management | All |
| `useOutletContext` | Parent → Child data | All |
| `useMatch` | URL pattern matching | All |
| `useRoutes` | Object-based routing | All |
| `useLoaderData` | Route loader data | Data + Framework |
| `useActionData` | Route action results | Data + Framework |
| `useFetcher` | Non-navigating mutations | Data + Framework |
| `useRouteError` | Route error info | Data + Framework |
| `useNavigation` | Navigation state | Data + Framework |
| `useRouteLoaderData` | Any route's loader data | Data + Framework |

---

## 📚 Most Used Components Quick Reference

| Component | Purpose | Mode |
|-----------|---------|------|
| `<BrowserRouter>` | App wrapper (Declarative) | Declarative |
| `<RouterProvider>` | App wrapper (Data) | Data + Framework |
| `<Routes>` | Route container | Declarative |
| `<Route>` | Define a route | Declarative |
| `<Link>` | Navigation link | All |
| `<NavLink>` | Navigation with active state | All |
| `<Navigate>` | Declarative redirect | All |
| `<Outlet>` | Render child routes | All |
| `<Form>` | Data-aware form | Data + Framework |

---

## 📖 Recommended Learning Path

```
1. Start with Declarative Mode (Folders 01–10)
   └── Master basic routing, navigation, and hooks

2. Move to Data Mode (Folders 11–16)
   └── Learn data loading, actions, and fetchers

3. Learn Patterns (Folders 17–22)
   └── Protected routes, error handling, lazy loading

4. Explore Framework Mode (Folder 23)
   └── Full-stack React Router with SSR/SSG
```

---

## 🛠️ Quick Setup

```bash
# Create a new React project with Vite
npm create vite@latest my-router-app -- --template react

# Install React Router
cd my-router-app
npm install react-router

# Start dev server
npm run dev
```

---

## ✍️ Author

**Ashutosh Kumar** — Learning React Router DOM systematically! 🚀

---

> Made with ❤️ for structured learning. Each folder contains a detailed README with explanations, code examples, comparison tables, and key takeaways.
