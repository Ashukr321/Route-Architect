# 🎯 Project 01 — Personal Portfolio Website

## 📊 Difficulty: ⭐ Beginner

---

## 📋 Situation / Use Case

You are a **frontend developer** who wants to build a personal portfolio website to showcase your projects, skills, and experience. The site should have multiple pages (Home, About, Projects, Contact) with smooth navigation and no page reloads.

**Client Requirement**: "I want a clean, multi-page portfolio where visitors can browse different sections without the page refreshing."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| BrowserRouter | [`_01_routers`](../../_01_routers) |
| Routes & Route | [`_02_routes_and_route`](../../_02_routes_and_route) |
| Link & NavLink | [`_03_link_and_navlink`](../../_03_link_and_navlink) |
| 404 Not Found Page | [`_02_routes_and_route`](../../_02_routes_and_route) |

---

## 🏗️ Project Setup

```bash
# Create project
npm create vite@latest personal-portfolio -- --template react
cd personal-portfolio

# Install React Router
npm install react-router

# Start dev server
npm run dev
```

---

## 📁 Folder Structure

```
src/
├── App.jsx
├── main.jsx
├── components/
│   ├── Navbar.jsx
│   └── Footer.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Projects.jsx
│   ├── Contact.jsx
│   └── NotFound.jsx
└── styles/
    └── App.css
```

---

## 🛣️ Routing Approach

```jsx
// main.jsx
import { BrowserRouter } from "react-router";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

```jsx
// App.jsx
import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
```

```jsx
// components/Navbar.jsx
import { NavLink } from "react-router";

function Navbar() {
  return (
    <nav>
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/projects">Projects</NavLink>
      <NavLink to="/contact">Contact</NavLink>
    </nav>
  );
}
```

---

## ✅ What You'll Learn

1. How to **wrap your app** with `BrowserRouter`
2. How to define **basic routes** with `<Routes>` and `<Route>`
3. How to create **navigation** with `NavLink` (with active states)
4. How to handle **404 pages** with `path="*"`
5. Difference between `Link` and `NavLink`

---

## 🎯 Practice Tasks

- [ ] Add active styling to NavLink (highlight current page)
- [ ] Create a smooth scroll-to-top on page change
- [ ] Add a "Back to Home" link on the 404 page
- [ ] Style the NavLink `.active` class with CSS
