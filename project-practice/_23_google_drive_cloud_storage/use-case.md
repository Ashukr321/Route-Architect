# 🎯 Project 23 — Google Drive Clone (Cloud Storage & Collaboration)

## 📊 Difficulty: 🔥🔥🔥🔥🔥 Enterprise-Grade

---

## 📋 Situation / Use Case

You're building a **cloud storage and collaboration platform** like Google Drive. Users can create folders, upload files, share with granular permissions, navigate nested folder structures via URL, preview files, and manage shared drives for teams.

**Client Requirement**: "Build a Google Drive-like app where:
- Folder navigation is URL-driven (`/drive/folders/:folderId`)
- Users can share files/folders with Viewer/Commenter/Editor permissions
- Shared with Me, Starred, Trash are separate views
- Team Drives (shared drives) have their own access model
- File preview opens as a route (shareable URL for each file)
- Right-click context menu triggers actions (rename, move, share)
- Breadcrumb navigation shows the full folder path
- Search filters by file type, owner, date modified"

---

## 🧠 RBAC & Permission System

```jsx
// Google Drive-style sharing permissions
export const FILE_PERMISSIONS = {
  OWNER: "owner",         // Full control, can delete, transfer ownership
  EDITOR: "editor",       // Edit, share with others, change permissions
  COMMENTER: "commenter", // View + comment only
  VIEWER: "viewer",       // View only, download if allowed
  NONE: "none",           // No access
};

export const DRIVE_ROLES = {
  MANAGER: "manager",     // Manage members + content in shared drive
  CONTENT_MANAGER: "content_manager", // Add/edit/move content
  CONTRIBUTOR: "contributor",         // Add files but can't edit others'
  COMMENTER: "commenter",
  VIEWER: "viewer",
};

// Sharing model
// Each file/folder has an Access Control List (ACL)
// ACL entry: { userId | email | "anyone", permission, expiresAt? }

function useFilePermission(fileId) {
  const { user } = useAuth();
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    api.getFilePermission(fileId, user.id).then(setPermission);
  }, [fileId, user.id]);

  return {
    permission,
    canView: ["viewer", "commenter", "editor", "owner"].includes(permission),
    canComment: ["commenter", "editor", "owner"].includes(permission),
    canEdit: ["editor", "owner"].includes(permission),
    canShare: ["editor", "owner"].includes(permission),
    canDelete: permission === "owner",
    isOwner: permission === "owner",
  };
}
```

```jsx
// File access guard — different from page guards!
// Files can be shared with specific users, or "anyone with link"
function FileAccessGuard() {
  const { fileId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [access, setAccess] = useState("loading");

  useEffect(() => {
    async function checkAccess() {
      const result = await api.checkFileAccess(fileId, user?.id);
      setAccess(result);
    }
    checkAccess();
  }, [fileId, user?.id]);

  if (access === "loading") return <LoadingScreen />;
  if (access === "none") {
    return (
      <div className="access-denied">
        <h2>You need access</h2>
        <p>Ask the owner for access, or switch to an authorized account.</p>
        <button onClick={() => api.requestAccess(fileId)}>Request Access</button>
        <button onClick={() => navigate("/drive")}>Go to My Drive</button>
      </div>
    );
  }

  return <Outlet context={{ permission: access }} />;
}
```

---

## 🛣️ Routing Architecture

```jsx
const router = createBrowserRouter([
  // ========== PUBLIC / SHARED LINKS ==========
  {
    path: "/file/:fileId/view",
    lazy: () => import("./pages/public/SharedFileView"),
    loader: sharedFileLoader, // Checks if file is shared publicly
    errorElement: <AccessDenied />,
  },

  // ========== APP ==========
  {
    id: "drive-root",
    path: "/",
    lazy: () => import("./layouts/DriveLayout"),
    loader: driveRootLoader, // User data, quota, recent files
    children: [
      // Redirect root to My Drive
      { index: true, element: <Navigate to="/drive" replace /> },

      // ====== MY DRIVE ======
      {
        path: "drive",
        lazy: () => import("./pages/drive/DriveLayout"),
        children: [
          // Root of My Drive
          { index: true, lazy: () => import("./pages/drive/MyDriveRoot") },
          
          // ⭐ Folder navigation — the core of Google Drive routing
          {
            path: "folders/:folderId",
            lazy: () => import("./pages/drive/FolderView"),
            loader: folderLoader,
            // URL: /drive/folders/abc123
            // Shows contents of folder abc123
          },
        ],
      },

      // ====== SHARED WITH ME ======
      {
        path: "shared-with-me",
        lazy: () => import("./pages/drive/SharedWithMe"),
        loader: sharedWithMeLoader,
        // /shared-with-me?type=folder&sortBy=sharedDate
      },

      // ====== RECENT ======
      { path: "recent", lazy: () => import("./pages/drive/Recent") },

      // ====== STARRED ======
      { path: "starred", lazy: () => import("./pages/drive/Starred") },

      // ====== TRASH ======
      {
        path: "trash",
        lazy: () => import("./pages/drive/Trash"),
        // Trash has its own actions: restore, permanent delete
      },

      // ====== SHARED DRIVES (Team Drives) ======
      {
        path: "shared-drives",
        lazy: () => import("./pages/sharedDrives/SharedDrivesLayout"),
        children: [
          { index: true, lazy: () => import("./pages/sharedDrives/DriveList") },
          {
            path: ":driveId",
            lazy: () => import("./pages/sharedDrives/SharedDriveView"),
            loader: sharedDriveLoader,
            children: [
              { index: true, lazy: () => import("./pages/sharedDrives/DriveContents") },
              {
                path: "folders/:folderId",
                lazy: () => import("./pages/sharedDrives/FolderView"),
              },
              // Shared Drive Settings (Manager only)
              {
                path: "settings",
                element: <SharedDriveGuard minRole="manager" />,
                children: [
                  {
                    lazy: () => import("./pages/sharedDrives/settings/SettingsLayout"),
                    children: [
                      { path: "members", lazy: () => import("./pages/sharedDrives/settings/Members") },
                      { path: "permissions", lazy: () => import("./pages/sharedDrives/settings/Permissions") },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // ====== FILE PREVIEW (opens as a full-page overlay) ======
      {
        path: "file/:fileId",
        element: <FileAccessGuard />,
        children: [
          {
            lazy: () => import("./pages/file/FilePreview"),
            children: [
              { index: true, lazy: () => import("./pages/file/PreviewContent") },
              { path: "details", lazy: () => import("./pages/file/FileDetails") },
              { path: "activity", lazy: () => import("./pages/file/FileActivity") },
              { path: "versions", lazy: () => import("./pages/file/VersionHistory") },
              { path: "sharing", lazy: () => import("./pages/file/SharingSettings") },
              {
                path: "sharing/manage",
                element: <PermissionGuard check={(p) => p.canShare} />,
                children: [
                  { index: true, lazy: () => import("./pages/file/ManageSharing") },
                ],
              },
            ],
          },
        ],
      },

      // ====== SEARCH ======
      {
        path: "search",
        lazy: () => import("./pages/search/SearchResults"),
        // /search?q=report&type=document&owner=me&modified=last7days&in=myDrive
      },

      // ====== STORAGE / QUOTA ======
      { path: "storage", lazy: () => import("./pages/Storage") },

      // ====== SETTINGS ======
      {
        path: "settings",
        lazy: () => import("./pages/settings/SettingsLayout"),
        children: [
          { path: "general", lazy: () => import("./pages/settings/General") },
          { path: "notifications", lazy: () => import("./pages/settings/Notifications") },
          { path: "offline", lazy: () => import("./pages/settings/OfflineAccess") },
        ],
      },

      // ====== ADMIN (Workspace Admin) ======
      {
        path: "admin",
        element: <PermissionGuard requiredPermissions={["workspace_admin"]} />,
        children: [
          {
            lazy: () => import("./pages/admin/AdminLayout"),
            children: [
              { path: "users", lazy: () => import("./pages/admin/Users") },
              { path: "storage", lazy: () => import("./pages/admin/StorageManagement") },
              { path: "sharing", lazy: () => import("./pages/admin/SharingPolicies") },
              { path: "compliance", lazy: () => import("./pages/admin/Compliance") },
              { path: "audit", lazy: () => import("./pages/admin/AuditLog") },
            ],
          },
        ],
      },
    ],
  },
]);
```

---

## 🔑 Key Routing Patterns from Google Drive

### 1. Folder Navigation with Breadcrumbs
```jsx
function FolderView() {
  const { folderId } = useParams();
  const folderData = useLoaderData();

  // Build breadcrumb from folder ancestors
  // folderData.ancestors = [{ id: "root", name: "My Drive" }, { id: "abc", name: "Projects" }]

  return (
    <div>
      <Breadcrumb>
        <Link to="/drive">My Drive</Link>
        {folderData.ancestors.map((folder) => (
          <Link key={folder.id} to={`/drive/folders/${folder.id}`}>
            {folder.name}
          </Link>
        ))}
        <span>{folderData.name}</span>
      </Breadcrumb>

      <FileGrid files={folderData.files} folders={folderData.subfolders} />
    </div>
  );
}
```

### 2. Sharing Dialog (Permission-Aware)
```jsx
function ManageSharing() {
  const { fileId } = useParams();
  const { permission } = useOutletContext();
  const fetcher = useFetcher();

  const handleShare = (email, role) => {
    fetcher.submit(
      { email, role, fileId },
      { method: "post", action: `/api/share` }
    );
  };

  const handleChangeRole = (userId, newRole) => {
    // Only editors/owners can change roles
    if (!permission.canShare) return;
    fetcher.submit(
      { userId, role: newRole, fileId },
      { method: "put", action: `/api/share` }
    );
  };

  return (
    <div>
      <ShareInput onShare={handleShare} />
      <AccessList fileId={fileId} onChangeRole={handleChangeRole} />
      <LinkShareToggle fileId={fileId} />
    </div>
  );
}
```

### 3. Context Menu Actions
```jsx
function FileContextMenu({ file, position }) {
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const actions = [
    { label: "Preview", action: () => navigate(`/file/${file.id}`) },
    { label: "Share", action: () => navigate(`/file/${file.id}/sharing`) },
    { label: "⭐ Star", action: () => fetcher.submit({ fileId: file.id }, { method: "post", action: "/api/star" }) },
    { label: "Move to", action: () => navigate(`/file/${file.id}?action=move`) },
    { label: "Rename", action: () => fetcher.submit({ fileId: file.id, name: newName }, { method: "put", action: "/api/rename" }) },
    { label: "🗑️ Trash", action: () => fetcher.submit({ fileId: file.id }, { method: "delete", action: "/api/trash" }) },
  ];

  return <ContextMenu items={actions} position={position} />;
}
```

---

## ✅ What You'll Learn

1. **File-level ACL permissions** — Owner/Editor/Commenter/Viewer per file
2. **Shared Drive role management** — Team-level access control
3. **Folder-based navigation** where folder ID = route param
4. **Breadcrumb building** from ancestor folder chain
5. **File preview routes** with permission-dependent sub-sections
6. **Context menu actions** using `useFetcher` (star, rename, trash — no navigation)
7. **Public file sharing** with "anyone with link" link model
8. **Access request flow** when user doesn't have permission

---

## 🎯 Practice Tasks

- [ ] Implement drag-and-drop file moving with route update
- [ ] Build version history comparison (diff between versions)
- [ ] Add "Make a Copy" that navigates to the copy's location
- [ ] Implement offline access management routes
- [ ] Build file type-based preview (PDF viewer, image viewer, video player)
- [ ] Add workspace admin audit log with activity filtering
