# 🎯 Project 08 — Documentation Site with Dynamic Sidebar

## 📊 Difficulty: ⭐⭐⭐ Intermediate

---

## 📋 Situation / Use Case

You're building a **documentation website** (like React docs, Vite docs) with a nested sidebar that shows sections and subsections. The sidebar highlights the current page, and the URL reflects the current document being viewed.

**Client Requirement**: "Build a docs site where the sidebar shows all topics grouped by section. The URL should be like `/docs/getting-started/installation`. The sidebar should auto-expand the current section."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| Nested Routes (deep) | [`_08_outlet_and_nested_routes`](../../_08_outlet_and_nested_routes) |
| useParams (slug) | [`_05_useParams`](../../_05_useParams) |
| useMatch (sidebar) | [`_18_useMatch`](../../_18_useMatch) |
| useLocation | [`_06_useLocation`](../../_06_useLocation) |
| NavLink | [`_03_link_and_navlink`](../../_03_link_and_navlink) |
| useRoutes (object config) | [`_10_useRoutes`](../../_10_useRoutes) |
| Splat routes | [`_02_routes_and_route`](../../_02_routes_and_route) |

---

## 🛣️ Routing Approach

```jsx
// Using useRoutes for data-driven route generation
const docsRoutes = useRoutes([
  {
    path: "/docs",
    element: <DocsLayout />,
    children: [
      { index: true, element: <Navigate to="getting-started/introduction" replace /> },
      {
        path: "getting-started",
        children: [
          { path: "introduction", element: <DocPage slug="introduction" /> },
          { path: "installation", element: <DocPage slug="installation" /> },
          { path: "quick-start", element: <DocPage slug="quick-start" /> },
        ],
      },
      {
        path: "guides",
        children: [
          { path: "routing", element: <DocPage slug="routing" /> },
          { path: "navigation", element: <DocPage slug="navigation" /> },
          { path: "data-loading", element: <DocPage slug="data-loading" /> },
        ],
      },
      {
        path: "api",
        children: [
          { path: "hooks", element: <DocPage slug="hooks" /> },
          { path: "components", element: <DocPage slug="components" /> },
        ],
      },
    ],
  },
]);
```

```jsx
// components/DocsSidebar.jsx
import { NavLink, useLocation } from "react-router";

const SECTIONS = [
  {
    title: "Getting Started",
    basePath: "/docs/getting-started",
    items: [
      { path: "introduction", label: "Introduction" },
      { path: "installation", label: "Installation" },
      { path: "quick-start", label: "Quick Start" },
    ],
  },
  {
    title: "Guides",
    basePath: "/docs/guides",
    items: [
      { path: "routing", label: "Routing" },
      { path: "navigation", label: "Navigation" },
      { path: "data-loading", label: "Data Loading" },
    ],
  },
];

function DocsSidebar() {
  const location = useLocation();

  return (
    <aside className="docs-sidebar">
      {SECTIONS.map((section) => {
        const isExpanded = location.pathname.startsWith(section.basePath);

        return (
          <div key={section.title} className="sidebar-section">
            <h3 className={isExpanded ? "expanded" : ""}>{section.title}</h3>
            <ul className={isExpanded ? "visible" : "collapsed"}>
              {section.items.map((item) => (
                <li key={item.path}>
                  <NavLink to={`${section.basePath}/${item.path}`}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </aside>
  );
}
```

---

## ✅ What You'll Learn

1. How to build a **deeply nested route structure** for docs
2. How to use **`useLocation`** to auto-expand sidebar sections
3. How to generate routes from **data objects** with `useRoutes`
4. How to handle **many routes** in a scalable, maintainable way
5. How to build **auto-highlighting sidebar** navigation

---

## 🎯 Practice Tasks

- [ ] Add "Previous / Next" page navigation at the bottom
- [ ] Implement a search bar that filters sidebar items
- [ ] Add hash-based section anchors (`#section-title`)
- [ ] Show a table of contents for the current page using `hash`
- [ ] Make sidebar collapsible on mobile
