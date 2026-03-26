# 🎯 Project 10 — Project Management Tool (Trello/Jira Clone)

## 📊 Difficulty: ⭐⭐⭐ Intermediate-Advanced

---

## 📋 Situation / Use Case

You're building a **project management tool** where users manage multiple projects, each with boards containing task lists. The URL structure mirrors the hierarchy: `/projects/123/board/456/task/789`.

**Client Requirement**: "Users should be able to navigate between projects, view boards, and click tasks to see details in a side panel or modal. The URL should always reflect what the user is looking at."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| Deep Nested Routes | [`_08_outlet_and_nested_routes`](../../_08_outlet_and_nested_routes) |
| Multiple useParams | [`_05_useParams`](../../_05_useParams) |
| useNavigate | [`_04_useNavigate`](../../_04_useNavigate) |
| useLocation (modal) | [`_06_useLocation`](../../_06_useLocation) |
| useSearchParams | [`_07_useSearchParams`](../../_07_useSearchParams) |
| Protected Routes | [`_20_protected_routes`](../../_20_protected_routes) |
| useOutletContext | [`_17_useOutletContext`](../../_17_useOutletContext) |
| useRoutes | [`_10_useRoutes`](../../_10_useRoutes) |

---

## 🛣️ Routing Approach

```jsx
// App.jsx
<Routes>
  {/* Public */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<Login />} />

  {/* Protected App */}
  <Route element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
      <Route path="/projects" element={<ProjectList />} />
      <Route path="/projects/:projectId" element={<ProjectLayout />}>
        <Route index element={<ProjectOverview />} />
        <Route path="board" element={<BoardView />} />
        <Route path="board/:boardId" element={<BoardDetail />}>
          <Route path="task/:taskId" element={<TaskModal />} />
        </Route>
        <Route path="settings" element={<ProjectSettings />} />
        <Route path="members" element={<ProjectMembers />} />
      </Route>
    </Route>
  </Route>
</Routes>
```

```jsx
// Modal Route Pattern — task opens as modal over board
import { useParams, useNavigate, Outlet, useLocation } from "react-router";

function BoardDetail() {
  const { boardId, projectId } = useParams();
  const location = useLocation();

  return (
    <div className="board">
      <h2>Board: {boardId}</h2>
      <div className="columns">
        {columns.map((col) => (
          <div key={col.id} className="column">
            <h3>{col.name}</h3>
            {col.tasks.map((task) => (
              <Link
                key={task.id}
                to={`/projects/${projectId}/board/${boardId}/task/${task.id}`}
                state={{ backgroundLocation: location }}
              >
                <TaskCard task={task} />
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Task modal renders here as a nested route */}
      <Outlet />
    </div>
  );
}

// TaskModal — renders as overlay
function TaskModal() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="modal-overlay" onClick={() => navigate(-1)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Task: {taskId}</h2>
        <button onClick={() => navigate(-1)}>Close</button>
        {/* Task details here */}
      </div>
    </div>
  );
}
```

---

## ✅ What You'll Learn

1. How to handle **deeply nested URL hierarchies** (project → board → task)
2. How to access **multiple params** from nested routes
3. How to implement **modal routes** (task opens as modal, has its own URL)
4. How to use **`location.state`** for background location pattern
5. How to combine **multiple routing patterns** in a real app

---

## 🎯 Practice Tasks

- [ ] Add drag-and-drop task reordering (update URL on move)
- [ ] Implement task filters via search params (?status=done&priority=high)
- [ ] Add a full-page task view at `/projects/:id/task/:taskId`
- [ ] Create a project settings page with sub-tabs (General, Permissions)
- [ ] Add real-time task updates with WebSocket integration
