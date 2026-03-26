# 🎯 Project 02 — Blog Platform

## 📊 Difficulty: ⭐ Beginner

---

## 📋 Situation / Use Case

You're building a **blog platform** where users can browse blog posts, click on a post to read the full article, and the URL updates to reflect which post they're viewing (e.g., `/blog/my-first-post`).

**Client Requirement**: "Each blog post should have its own unique URL so users can share links to specific articles."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| Dynamic Segments (`:slug`) | [`_02_routes_and_route`](../../_02_routes_and_route) |
| useParams | [`_05_useParams`](../../_05_useParams) |
| Link | [`_03_link_and_navlink`](../../_03_link_and_navlink) |
| useNavigate | [`_04_useNavigate`](../../_04_useNavigate) |

---

## 🏗️ Project Setup

```bash
npm create vite@latest blog-platform -- --template react
cd blog-platform
npm install react-router
npm run dev
```

---

## 📁 Folder Structure

```
src/
├── App.jsx
├── main.jsx
├── data/
│   └── posts.js          # Static blog data
├── pages/
│   ├── BlogList.jsx       # List all blogs
│   ├── BlogPost.jsx       # Single blog detail
│   └── NotFound.jsx
└── components/
    ├── Navbar.jsx
    └── PostCard.jsx
```

---

## 🛣️ Routing Approach

```jsx
// App.jsx
import { Routes, Route } from "react-router";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

```jsx
// pages/BlogList.jsx
import { Link } from "react-router";
import { posts } from "../data/posts";

function BlogList() {
  return (
    <div>
      <h1>All Blog Posts</h1>
      {posts.map((post) => (
        <div key={post.slug}>
          <Link to={`/blog/${post.slug}`}>
            <h2>{post.title}</h2>
          </Link>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  );
}
```

```jsx
// pages/BlogPost.jsx
import { useParams, useNavigate } from "react-router";
import { posts } from "../data/posts";

function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div>
        <h1>Post Not Found</h1>
        <button onClick={() => navigate("/blog")}>Back to Blog</button>
      </div>
    );
  }

  return (
    <article>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h1>{post.title}</h1>
      <p>{post.date}</p>
      <div>{post.content}</div>
    </article>
  );
}
```

```js
// data/posts.js
export const posts = [
  {
    slug: "getting-started-react",
    title: "Getting Started with React",
    excerpt: "Learn the basics of React...",
    content: "Full article content here...",
    date: "2026-03-01",
  },
  {
    slug: "css-grid-mastery",
    title: "CSS Grid Mastery",
    excerpt: "Master CSS Grid layout...",
    content: "Full article content here...",
    date: "2026-03-15",
  },
];
```

---

## ✅ What You'll Learn

1. How to create **dynamic routes** with `:slug` parameter
2. How to **read URL params** with `useParams()`
3. How to build **dynamic links** with template literals
4. How to use **`useNavigate(-1)`** for a back button
5. How to handle **non-existent** dynamic routes gracefully

---

## 🎯 Practice Tasks

- [ ] Add a "Next Post" / "Previous Post" navigation
- [ ] Show a loading state when finding the post
- [ ] Add categories and filter posts by category
- [ ] Create breadcrumbs: Home > Blog > Post Title
