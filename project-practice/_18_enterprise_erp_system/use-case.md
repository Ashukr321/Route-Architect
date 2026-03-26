# 🎯 Project 18 — Enterprise ERP System

## 📊 Difficulty: ⭐⭐⭐⭐⭐ Expert

---

## 📋 Situation / Use Case

You're building an **Enterprise Resource Planning (ERP) system** with modules for HR, Finance, Inventory, Sales, and Reports. Each module has its own sub-routing, authentication, and role-based access. The system must handle 50+ routes, lazy-load modules, and support deep linking.

**Client Requirement**: "We need a modular ERP where each department (HR, Finance, Inventory) has its own section with dozens of pages. The system should be fast (lazy load everything), secure (role-based), and have a consistent layout. Route configuration should be maintainable at scale."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| createBrowserRouter | [`_11_data_routers`](../../_11_data_routers) |
| Lazy Loading (all modules) | [`_22_lazy_loading_routes`](../../_22_lazy_loading_routes) |
| useRoutes (modular config) | [`_10_useRoutes`](../../_10_useRoutes) |
| Role-Based Guards | [`_20_protected_routes`](../../_20_protected_routes) |
| Nested Layouts | [`_08_outlet_and_nested_routes`](../../_08_outlet_and_nested_routes) |
| loader / action | [`_12_loader`](../../_12_loader) / [`_13_action`](../../_13_action) |
| useRouteLoaderData | [`_14_useLoaderData`](../../_14_useLoaderData) |
| useRouteError | [`_19_useRouteError`](../../_19_useRouteError) |
| Error Boundaries | [`_21_error_boundaries`](../../_21_error_boundaries) |
| useSearchParams | [`_07_useSearchParams`](../../_07_useSearchParams) |
| useFetcher | [`_16_useFetcher`](../../_16_useFetcher) |
| useActionData | [`_15_useActionData`](../../_15_useActionData) |

---

## 🛣️ Routing Approach — Modular Architecture

```jsx
// routes/index.js — Central route aggregator
import { hrRoutes } from "./hr.routes";
import { financeRoutes } from "./finance.routes";
import { inventoryRoutes } from "./inventory.routes";
import { salesRoutes } from "./sales.routes";
import { reportRoutes } from "./report.routes";

export const appRoutes = [
  {
    id: "root",
    path: "/",
    lazy: () => import("../layouts/AppLayout"),
    loader: rootLoader,
    errorElement: <GlobalError />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: "dashboard",
        lazy: () => import("../pages/Dashboard"),
      },
      ...hrRoutes,
      ...financeRoutes,
      ...inventoryRoutes,
      ...salesRoutes,
      ...reportRoutes,
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/login",
    lazy: () => import("../pages/Login"),
  },
];

const router = createBrowserRouter(appRoutes);
```

```jsx
// routes/hr.routes.js — HR Module (isolated)
export const hrRoutes = [
  {
    path: "hr",
    lazy: () => import("../modules/hr/HRLayout"),
    loader: roleGatedLoader(["hr_admin", "hr_manager", "admin"]),
    children: [
      { index: true, lazy: () => import("../modules/hr/Dashboard") },
      { path: "employees", lazy: () => import("../modules/hr/EmployeeList") },
      { path: "employees/new", lazy: () => import("../modules/hr/EmployeeForm") },
      { path: "employees/:empId", lazy: () => import("../modules/hr/EmployeeDetail") },
      { path: "employees/:empId/edit", lazy: () => import("../modules/hr/EmployeeForm") },
      { path: "attendance", lazy: () => import("../modules/hr/Attendance") },
      { path: "leave-management", lazy: () => import("../modules/hr/LeaveManagement") },
      { path: "leave-management/:leaveId", lazy: () => import("../modules/hr/LeaveDetail") },
      { path: "payroll", lazy: () => import("../modules/hr/Payroll") },
      { path: "payroll/:payrollId", lazy: () => import("../modules/hr/PayrollDetail") },
      { path: "recruitment", lazy: () => import("../modules/hr/Recruitment") },
    ],
  },
];

// routes/finance.routes.js — Finance Module
export const financeRoutes = [
  {
    path: "finance",
    lazy: () => import("../modules/finance/FinanceLayout"),
    loader: roleGatedLoader(["finance_admin", "accountant", "admin"]),
    children: [
      { index: true, lazy: () => import("../modules/finance/Dashboard") },
      { path: "invoices", lazy: () => import("../modules/finance/InvoiceList") },
      { path: "invoices/new", lazy: () => import("../modules/finance/InvoiceForm") },
      { path: "invoices/:invoiceId", lazy: () => import("../modules/finance/InvoiceDetail") },
      { path: "expenses", lazy: () => import("../modules/finance/Expenses") },
      { path: "budgets", lazy: () => import("../modules/finance/Budgets") },
      { path: "tax", lazy: () => import("../modules/finance/TaxManagement") },
      { path: "ledger", lazy: () => import("../modules/finance/GeneralLedger") },
    ],
  },
];
```

```jsx
// Modular layout — each module has its own sidebar
// modules/hr/HRLayout.jsx
export function Component() {
  const rootData = useRouteLoaderData("root");

  return (
    <div className="module-layout">
      <ModuleSidebar
        title="Human Resources"
        items={[
          { path: "/hr", label: "Dashboard", end: true },
          { path: "/hr/employees", label: "Employees" },
          { path: "/hr/attendance", label: "Attendance" },
          { path: "/hr/leave-management", label: "Leave" },
          { path: "/hr/payroll", label: "Payroll" },
          { path: "/hr/recruitment", label: "Recruitment" },
        ]}
      />
      <div className="module-content">
        <Outlet />
      </div>
    </div>
  );
}
```

---

## ✅ What You'll Learn

1. How to build **modular route architecture** — each module in its own file
2. How to **scale routing** to 50+ routes while keeping it maintainable
3. How **lazy loading per module** keeps bundle size small
4. How to use **route ID-based data sharing** across modules
5. How to implement **module-level role guards** with shared loader factories
6. Production architecture for **enterprise-grade applications**

---

## 🎯 Practice Tasks

- [ ] Add a global search that navigates to the correct module + entity
- [ ] Implement breadcrumbs that work across all module depths
- [ ] Add a "Recently Visited" section using sessionStorage + routes
- [ ] Create a module registration system (plug-in new modules dynamically)
- [ ] Build a route-based permission matrix (UI to configure access)
