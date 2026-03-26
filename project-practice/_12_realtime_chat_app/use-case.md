# 🎯 Project 12 — Real-Time Chat Application

## 📊 Difficulty: ⭐⭐⭐ Advanced

---

## 📋 Situation / Use Case

You're building a **real-time chat application** (like Slack/Discord) with channels, direct messages, and thread views. Each conversation has its own URL, and switching channels updates the URL without full page reload.

**Client Requirement**: "Users should be able to switch between channels and DMs. Each channel/DM has a unique URL. Opening a thread should show it in a side panel with its own URL like `/channels/general/thread/123`."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| Dynamic Nested Routes | [`_08_outlet_and_nested_routes`](../../_08_outlet_and_nested_routes) |
| useParams (channelId, threadId) | [`_05_useParams`](../../_05_useParams) |
| useNavigate | [`_04_useNavigate`](../../_04_useNavigate) |
| useLocation (thread panel) | [`_06_useLocation`](../../_06_useLocation) |
| useOutletContext | [`_17_useOutletContext`](../../_17_useOutletContext) |
| Protected Routes | [`_20_protected_routes`](../../_20_protected_routes) |
| useMatch | [`_18_useMatch`](../../_18_useMatch) |

---

## 🛣️ Routing Approach

```jsx
<Routes>
  <Route path="/login" element={<Login />} />

  <Route element={<ProtectedRoute />}>
    <Route element={<ChatLayout />}>
      <Route path="/channels" element={<ChannelList />}>
        <Route path=":channelId" element={<ChannelView />}>
          <Route path="thread/:threadId" element={<ThreadPanel />} />
        </Route>
      </Route>
      <Route path="/dm" element={<DirectMessages />}>
        <Route path=":recipientId" element={<DMConversation />} />
      </Route>
      <Route path="/settings" element={<ChatSettings />} />
    </Route>
  </Route>
</Routes>
```

```jsx
// ChatLayout — channel list sidebar + main area
function ChatLayout() {
  const [unreadCounts, setUnreadCounts] = useState({});

  return (
    <div className="chat-app">
      <ServerSidebar />
      <ChannelSidebar unreadCounts={unreadCounts} />
      <main className="chat-main">
        <Outlet context={{ setUnreadCounts }} />
      </main>
    </div>
  );
}

// ChannelView — messages + optional thread panel
function ChannelView() {
  const { channelId } = useParams();
  const threadMatch = useMatch("/channels/:channelId/thread/:threadId");

  return (
    <div className={`channel-view ${threadMatch ? "with-thread" : ""}`}>
      <div className="messages-area">
        <MessageList channelId={channelId} />
        <MessageInput channelId={channelId} />
      </div>
      {/* Thread panel renders alongside messages */}
      <Outlet />
    </div>
  );
}

// ThreadPanel — side panel with its own URL
function ThreadPanel() {
  const { threadId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="thread-panel">
      <div className="thread-header">
        <h3>Thread</h3>
        <button onClick={() => navigate(-1)}>✕</button>
      </div>
      <ThreadMessages threadId={threadId} />
      <ThreadInput threadId={threadId} />
    </div>
  );
}
```

---

## ✅ What You'll Learn

1. How to build **parallel panels** (messages + thread) with nested routes
2. How to use **`useMatch`** to conditionally adjust layout
3. How to handle **real-time data** with route-based state management
4. How to build **side-panel routes** (thread opens alongside, not replacing)
5. Complex **multi-level routing** for communication apps

---

## 🎯 Practice Tasks

- [ ] Add unread message indicators in channel sidebar
- [ ] Implement a search with results page (`/search?q=keyword`)
- [ ] Add user mentions that link to `/dm/:userId`
- [ ] Create a pinned messages panel route
- [ ] Add keyboard shortcuts for channel navigation
