# 🛣️ Route-Architect — React Router DOM Complete Learning Guide

> A comprehensive, structured guide to mastering **React Router DOM v7** — from absolute beginner to production-level pro.

📖 **Official Docs**: [https://reactrouter.com/home](https://reactrouter.com/home)

---

## 📂 Concepts — Folder Structure

All topics are organized in numbered folders starting from the **most commonly used** concepts, progressing to advanced topics.

---

### 🟢 Core Concepts (Most Used — Start Here!)

| # | Folder | Topic | Key APIs |
|---|--------|-------|----------|
| 01 | [`_01_routers`](./_01_routers/README.md) | **Routers** | `BrowserRouter`, `HashRouter`, `MemoryRouter` |
| 02 | [`_02_routes_and_route`](./_02_routes_and_route/README.md) | **Routes & Route** | `<Routes>`, `<Route>`, Dynamic Segments, Splats |
| 03 | [`_03_link_and_navlink`](./_03_link_and_navlink/README.md) | **Link & NavLink** | `<Link>`, `<NavLink>`, Active States |
| 04 | [`_04_useNavigate`](./_04_useNavigate/README.md) | **useNavigate Hook** | Programmatic Navigation, History |
| 05 | [`_05_useParams`](./_05_useParams/README.md) | **useParams Hook** | URL Parameters, Dynamic Segments |
| 06 | [`_06_useLocation`](./_06_useLocation/README.md) | **useLocation Hook** | Current URL Info, State, Analytics |
| 07 | [`_07_useSearchParams`](./_07_useSearchParams/README.md) | **useSearchParams Hook** | Query Strings, Filters, Pagination |
| 08 | [`_08_outlet_and_nested_routes`](./_08_outlet_and_nested_routes/README.md) | **Outlet & Nested Routes** | `<Outlet>`, Layout Routes, Nesting |
| 09 | [`_09_navigate_redirect`](./_09_navigate_redirect/README.md) | **Navigate Component** | `<Navigate>`, Declarative Redirects |
| 10 | [`_10_useRoutes`](./_10_useRoutes/README.md) | **useRoutes Hook** | Object-based Route Config |

---

### 🔵 Data Mode APIs

| # | Folder | Topic | Key APIs |
|---|--------|-------|----------|
| 11 | [`_11_data_routers`](./_11_data_routers/README.md) | **Data Routers** | `createBrowserRouter`, `RouterProvider` |
| 12 | [`_12_loader`](./_12_loader/README.md) | **Loaders** | `loader`, Data Fetching Before Render |
| 13 | [`_13_action`](./_13_action/README.md) | **Actions** | `action`, `<Form>`, Data Mutations |
| 14 | [`_14_useLoaderData`](./_14_useLoaderData/README.md) | **useLoaderData Hook** | Access Pre-loaded Data |
| 15 | [`_15_useActionData`](./_15_useActionData/README.md) | **useActionData Hook** | Validation Errors, Action Results |
| 16 | [`_16_useFetcher`](./_16_useFetcher/README.md) | **useFetcher Hook** | Non-navigating Data Interactions |

---

### 🟣 Advanced Hooks

| # | Folder | Topic | Key APIs |
|---|--------|-------|----------|
| 17 | [`_17_useOutletContext`](./_17_useOutletContext/README.md) | **useOutletContext Hook** | Share Data Between Routes |
| 18 | [`_18_useMatch`](./_18_useMatch/README.md) | **useMatch Hook** | URL Pattern Matching |
| 19 | [`_19_useRouteError`](./_19_useRouteError/README.md) | **useRouteError Hook** | Error Handling in Data Routers |

---

### 🔴 Route Protection & Patterns

| # | Folder | Topic | Key APIs |
|---|--------|-------|----------|
| 20 | [`_20_protected_routes`](./_20_protected_routes/README.md) | **Protected Routes** | Auth Guards, Role-Based Access |
| 21 | [`_21_error_boundaries`](./_21_error_boundaries/README.md) | **Error Boundaries** | `errorElement`, 404 Pages |
| 22 | [`_22_lazy_loading_routes`](./_22_lazy_loading_routes/README.md) | **Lazy Loading** | Code Splitting, `React.lazy`, `lazy` |

---

### 🟡 Framework Mode & RSC

| # | Folder | Topic | Key APIs |
|---|--------|-------|----------|
| 23 | [`_23_framework_mode`](./_23_framework_mode/README.md) | **Framework Mode** | Route Module API, SSR/SSG, RSC |

---

## 🎯 Project Practice — 25 Real-World Projects

> Build your **thought process** from absolute beginner to production-level pro. Complexity increases with each project. The final 5 are **enterprise-grade** inspired by LinkedIn, GitHub, Google Drive, Amazon, and LeetCode.

### ⭐ Beginner Level

| # | Project | Concepts Practiced | Link |
|---|---------|-------------------|------|
| 01 | **Personal Portfolio** | BrowserRouter, Routes, NavLink, 404 Page | [📄 use-case.md](./project-practice/_01_personal_portfolio/use-case.md) |
| 02 | **Blog Platform** | Dynamic Segments `:slug`, useParams, useNavigate | [📄 use-case.md](./project-practice/_02_blog_platform/use-case.md) |
| 03 | **E-Commerce Product Listing** | useSearchParams, Filters, Pagination, URL State | [📄 use-case.md](./project-practice/_03_ecommerce_product_listing/use-case.md) |

### ⭐⭐ Intermediate Level

| # | Project | Concepts Practiced | Link |
|---|---------|-------------------|------|
| 04 | **Admin Dashboard** | Nested Routes, Outlet, Layout Routes, Breadcrumbs | [📄 use-case.md](./project-practice/_04_admin_dashboard/use-case.md) |
| 05 | **Authentication Flow** | Protected Routes, Guest Routes, Redirect After Login | [📄 use-case.md](./project-practice/_05_authentication_flow/use-case.md) |
| 06 | **Multi-Step Form Wizard** | useOutletContext, Nested Steps, Progress Tracking | [📄 use-case.md](./project-practice/_06_multi_step_form/use-case.md) |
| 07 | **Social Media Profile** | Tabbed Navigation, Nested Routes, Index Routes | [📄 use-case.md](./project-practice/_07_social_media_profile/use-case.md) |
| 08 | **Documentation Site** | Deep Nesting, useRoutes, Dynamic Sidebar, useMatch | [📄 use-case.md](./project-practice/_08_documentation_site/use-case.md) |

### ⭐⭐⭐ Intermediate-Advanced Level

| # | Project | Concepts Practiced | Link |
|---|---------|-------------------|------|
| 09 | **E-Commerce Full Store** | Data Router, loader, action, useFetcher, Auto-Revalidation | [📄 use-case.md](./project-practice/_09_ecommerce_full_store/use-case.md) |
| 10 | **Project Management Tool** | Deep Nested Params, Modal Routes, Background Location | [📄 use-case.md](./project-practice/_10_project_management_tool/use-case.md) |

### ⭐⭐⭐⭐ Advanced Level

| # | Project | Concepts Practiced | Link |
|---|---------|-------------------|------|
| 11 | **Role-Based SaaS Dashboard** | Role Guards, Dynamic Sidebar, 403 Handling | [📄 use-case.md](./project-practice/_11_role_based_saas_dashboard/use-case.md) |
| 12 | **Real-Time Chat App** | Parallel Panels, Thread Routes, useMatch Layout | [📄 use-case.md](./project-practice/_12_realtime_chat_app/use-case.md) |
| 13 | **CMS with CRUD (Data Router)** | Full CRUD, useActionData, useNavigation, useFetcher | [📄 use-case.md](./project-practice/_13_cms_crud_data_router/use-case.md) |
| 14 | **Learning Management System** | Course Player, Progress Tracking, Optimistic UI | [📄 use-case.md](./project-practice/_14_learning_management_system/use-case.md) |
| 15 | **Multi-Tenant SaaS** | Lazy Loading, Feature Flags, useRouteLoaderData | [📄 use-case.md](./project-practice/_15_multi_tenant_saas/use-case.md) |
| 16 | **Healthcare Patient Portal** | Ownership-Based Access, Multi-Portal, Security | [📄 use-case.md](./project-practice/_16_healthcare_patient_portal/use-case.md) |

### ⭐⭐⭐⭐⭐ Expert / Production Level

| # | Project | Concepts Practiced | Link |
|---|---------|-------------------|------|
| 17 | **Analytics Dashboard** | Complex URL Filters, Multi-Value Params, Shareable State | [📄 use-case.md](./project-practice/_17_analytics_dashboard/use-case.md) |
| 18 | **Enterprise ERP System** | 50+ Routes, Modular Architecture, Scalable Config | [📄 use-case.md](./project-practice/_18_enterprise_erp_system/use-case.md) |
| 19 | **Micro-Frontend Architecture** | Splat Route Delegation, Module Federation, Cross-App Nav | [📄 use-case.md](./project-practice/_19_micro_frontend_architecture/use-case.md) |
| 20 | **Full-Stack Framework Mode** | SSR/SSG, Type-Safe Routes, Route Module API, ALL Concepts | [📄 use-case.md](./project-practice/_20_fullstack_framework_mode/use-case.md) |

### 🔥 Enterprise-Grade — RBAC & Permission-Based (Real-World Inspired)

| # | Project | Inspired By | Key RBAC Concepts | Link |
|---|---------|-------------|-------------------|------|
| 21 | **Professional Social Network** | **LinkedIn** | Roles (Individual/Recruiter/Company Admin/Premium), Permission Guards, Premium Feature Gating, Modal Routes on Feed, Multi-Portal Architecture | [📄 use-case.md](./project-practice/_21_linkedin_professional_network/use-case.md) |
| 22 | **Code Collaboration Platform** | **GitHub** | Repo-Level Permissions (Read/Triage/Write/Admin), Org Roles, Splat Routes for File Paths, Tab-Based Routing, Multi-Level Settings | [📄 use-case.md](./project-practice/_22_github_code_collaboration/use-case.md) |
| 23 | **Cloud Storage & Collaboration** | **Google Drive** | File-Level ACL (Owner/Editor/Viewer), Shared Drive Roles, Folder Navigation, Access Request Flow, Context Menu Actions | [📄 use-case.md](./project-practice/_23_google_drive_cloud_storage/use-case.md) |
| 24 | **Full E-Commerce Marketplace** | **Amazon/Flipkart** | Three Portals (Buyer/Seller/Admin), Seller Approval Workflow, Premium Seller Gating, 10+ URL Filters, Return/Refund Flows | [📄 use-case.md](./project-practice/_24_amazon_flipkart_marketplace/use-case.md) |
| 25 | **Competitive Coding Platform** | **LeetCode/HackerRank** | Content-Level Premium Gating, Time-Gated Contest Routes, Problem Setter/Organizer Portals, Workspace Split View, Submission Fetcher | [📄 use-case.md](./project-practice/_25_leetcode_coding_platform/use-case.md) |

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
Phase 1: Declarative Mode Fundamentals (Folders 01–10)
├── Master basic routing, navigation, and core hooks
├── Build Projects 01–03 (Portfolio, Blog, E-Commerce Listing)
└── 🎯 Goal: Comfortable with basic SPA routing

Phase 2: Intermediate Patterns (Folders 08, 17, 18, 20)
├── Master nested routes, layouts, and auth patterns
├── Build Projects 04–08 (Dashboard, Auth, Wizard, Profile, Docs)
└── 🎯 Goal: Build any multi-page app with confidence

Phase 3: Data Mode APIs (Folders 11–16, 19, 21)
├── Master loaders, actions, fetchers, and error handling
├── Build Projects 09–13 (E-Commerce, PM Tool, SaaS, Chat, CMS)
└── 🎯 Goal: Build data-driven apps with the modern approach

Phase 4: Production & Expert Patterns (Folders 20–23)
├── Master lazy loading, multi-tenant, and framework mode
├── Build Projects 14–20 (LMS, Multi-Tenant, ERP, Micro-FE, Full-Stack)
└── 🎯 Goal: Architect production-grade applications

Phase 5: Enterprise RBAC & Real-World Mastery (Projects 21–25) 🔥
├── Master RBAC, permission-based access, multi-portal architecture
├── Build LinkedIn, GitHub, Google Drive, Amazon, LeetCode clones
├── Learn granular permissions (file/repo/content-level), premium gating
├── Master time-gated routes, approval workflows, multi-team routing
└── 🎯 Goal: Architect ANY web application at ANY scale — YOU ARE A PRO!
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

**Ashutosh Kumar** — Mastering React Router DOM systematically! 🚀

---

> Made with ❤️ for structured learning. Each folder contains a detailed README with explanations, code examples, comparison tables, and key takeaways. The project practice section builds your thought process from absolute beginner to production-level expert.
