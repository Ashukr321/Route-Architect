# 🎯 Project 07 — Social Media Profile App

## 📊 Difficulty: ⭐⭐ Intermediate

---

## 📋 Situation / Use Case

You're building a **social media profile** section where users can view profiles with tabs (Posts, Followers, Following, Photos). Each tab should have its own URL, and the profile info stays visible while tab content changes.

**Client Requirement**: "The profile header (avatar, bio, stats) should stay fixed while users switch between Posts, Followers, and Following tabs. Each tab should be its own URL like `/user/john/followers`."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| Nested Routes + Outlet | [`_08_outlet_and_nested_routes`](../../_08_outlet_and_nested_routes) |
| useParams | [`_05_useParams`](../../_05_useParams) |
| NavLink (tabs) | [`_03_link_and_navlink`](../../_03_link_and_navlink) |
| Index Routes | [`_02_routes_and_route`](../../_02_routes_and_route) |
| useOutletContext | [`_17_useOutletContext`](../../_17_useOutletContext) |
| useMatch | [`_18_useMatch`](../../_18_useMatch) |

---

## 🛣️ Routing Approach

```jsx
// App.jsx
<Routes>
  <Route path="/" element={<Feed />} />
  <Route path="/user/:username" element={<ProfileLayout />}>
    <Route index element={<UserPosts />} />
    <Route path="followers" element={<Followers />} />
    <Route path="following" element={<Following />} />
    <Route path="photos" element={<Photos />} />
    <Route path="likes" element={<Likes />} />
  </Route>
  <Route path="/user/:username/post/:postId" element={<PostDetail />} />
</Routes>
```

```jsx
// pages/ProfileLayout.jsx
import { useParams, NavLink, Outlet } from "react-router";

function ProfileLayout() {
  const { username } = useParams();
  const user = useFetchUser(username); // custom hook

  return (
    <div className="profile">
      <div className="profile-header">
        <img src={user.avatar} alt={user.name} />
        <h1>{user.name}</h1>
        <p>@{username}</p>
        <p>{user.bio}</p>
        <div className="stats">
          <span>{user.postCount} Posts</span>
          <span>{user.followerCount} Followers</span>
          <span>{user.followingCount} Following</span>
        </div>
      </div>

      <nav className="profile-tabs">
        <NavLink to={`/user/${username}`} end>Posts</NavLink>
        <NavLink to={`/user/${username}/followers`}>Followers</NavLink>
        <NavLink to={`/user/${username}/following`}>Following</NavLink>
        <NavLink to={`/user/${username}/photos`}>Photos</NavLink>
        <NavLink to={`/user/${username}/likes`}>Likes</NavLink>
      </nav>

      <div className="tab-content">
        <Outlet context={{ user }} />
      </div>
    </div>
  );
}
```

```jsx
// pages/UserPosts.jsx (index route — default tab)
import { useOutletContext, Link, useParams } from "react-router";

function UserPosts() {
  const { user } = useOutletContext();
  const { username } = useParams();

  return (
    <div className="posts-grid">
      {user.posts.map((post) => (
        <Link key={post.id} to={`/user/${username}/post/${post.id}`}>
          <div className="post-card">
            <p>{post.content}</p>
            <span>{post.likes} likes</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

---

## ✅ What You'll Learn

1. How to build **tabbed navigation** with nested routes
2. How the **profile header persists** across tab changes (Outlet pattern)
3. How to use **useParams** for user-specific pages
4. How **index routes** serve as the default tab (Posts)
5. How to **share user data** from parent to child tabs via `useOutletContext`

---

## 🎯 Practice Tasks

- [ ] Add animated tab transitions
- [ ] Load follower/following lists with pagination
- [ ] Add a "Follow/Unfollow" button with optimistic UI
- [ ] Create a post detail page accessible from the posts tab
- [ ] Make tabs show the count (e.g., "Followers (234)")
