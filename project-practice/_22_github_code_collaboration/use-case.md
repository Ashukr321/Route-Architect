# 🎯 Project 22 — GitHub Clone (Code Collaboration Platform)

## 📊 Difficulty: 🔥🔥🔥🔥🔥 Enterprise-Grade

---

## 📋 Situation / Use Case

You're building a **code collaboration platform** like GitHub with repositories, issues, pull requests, code browsing, organizations, and fine-grained repository permissions. The URL structure mirrors the content hierarchy: `/org/repo/tree/branch/path/to/file`.

**Client Requirement**: "Build a GitHub-like platform where:
- Users own repositories with full CRUD
- Organizations have teams with different access levels (Read, Write, Admin)
- Repository URLs support branch switching and file path browsing
- Issues and PRs have their own routes with labels, milestones, and assignees as filters
- Code review has inline comment routes
- Settings are tiered: User → Org → Repo → each with sub-sections
- Forking links to the original repo
- Splat routes handle arbitrary file paths in the repo tree"

---

## 🧠 RBAC & Permission System

```jsx
// GitHub-style granular permissions
export const REPO_PERMISSIONS = {
  NONE: "none",
  READ: "read",           // View code, issues, PRs
  TRIAGE: "triage",       // + Manage issues/PRs (labels, assign)
  WRITE: "write",         // + Push code, merge PRs
  MAINTAIN: "maintain",   // + Manage repo settings (no destructive)
  ADMIN: "admin",         // Full control (delete repo, manage access)
};

export const ORG_ROLES = {
  MEMBER: "member",       // Access granted repos
  MODERATOR: "moderator", // + Manage teams
  OWNER: "owner",         // Full org control
  BILLING: "billing",     // Billing management only
};

// Permission checker
function useRepoPermission(owner, repo) {
  const { user } = useAuth();
  const [permission, setPermission] = useState(REPO_PERMISSIONS.NONE);

  useEffect(() => {
    async function check() {
      const perm = await api.getRepoPermission(owner, repo, user.id);
      setPermission(perm);
    }
    check();
  }, [owner, repo, user.id]);

  return {
    permission,
    canRead: permission !== "none",
    canTriage: ["triage", "write", "maintain", "admin"].includes(permission),
    canWrite: ["write", "maintain", "admin"].includes(permission),
    canMaintain: ["maintain", "admin"].includes(permission),
    canAdmin: permission === "admin",
  };
}
```

```jsx
// Route-level permission guard for repos
function RepoGuard({ minPermission = "read" }) {
  const { owner, repo } = useParams();
  const { permission, canRead } = useRepoPermission(owner, repo);

  if (permission === "none") {
    return <PrivateRepoMessage />;  // or 404 — GitHub shows 404 for unauthorized
  }

  const levels = ["read", "triage", "write", "maintain", "admin"];
  if (levels.indexOf(permission) < levels.indexOf(minPermission)) {
    return <InsufficientPermissions required={minPermission} />;
  }

  return <Outlet context={{ permission }} />;
}
```

---

## 🛣️ Routing Architecture

```jsx
const router = createBrowserRouter([
  // ========== PUBLIC ==========
  { path: "/", lazy: () => import("./pages/Home") },
  { path: "/login", lazy: () => import("./pages/auth/Login") },
  { path: "/signup", lazy: () => import("./pages/auth/Signup") },
  { path: "/explore", lazy: () => import("./pages/Explore") },
  { path: "/trending", lazy: () => import("./pages/Trending") },

  // ========== AUTHENTICATED SHELL ==========
  {
    id: "shell",
    path: "/",
    lazy: () => import("./layouts/AppShell"),
    loader: shellLoader,
    children: [
      // --- Dashboard ---
      { path: "dashboard", lazy: () => import("./pages/Dashboard") },

      // --- Notifications ---
      { path: "notifications", lazy: () => import("./pages/Notifications") },

      // --- New Repo ---
      { path: "new", lazy: () => import("./pages/repo/NewRepository") },

      // --- Search ---
      {
        path: "search",
        lazy: () => import("./pages/search/SearchLayout"),
        children: [
          { index: true, lazy: () => import("./pages/search/Results") },
          // /search?q=react+router&type=repositories&language=javascript&sort=stars
        ],
      },

      // --- User Settings ---
      {
        path: "settings",
        lazy: () => import("./pages/settings/UserSettingsLayout"),
        children: [
          { path: "profile", lazy: () => import("./pages/settings/Profile") },
          { path: "account", lazy: () => import("./pages/settings/Account") },
          { path: "appearance", lazy: () => import("./pages/settings/Appearance") },
          { path: "notifications", lazy: () => import("./pages/settings/Notifications") },
          { path: "security", lazy: () => import("./pages/settings/Security") },
          { path: "ssh-keys", lazy: () => import("./pages/settings/SSHKeys") },
          { path: "tokens", lazy: () => import("./pages/settings/PersonalTokens") },
          { path: "organizations", lazy: () => import("./pages/settings/Organizations") },
          { path: "billing", lazy: () => import("./pages/settings/Billing") },
        ],
      },

      // ========== ORGANIZATION ROUTES ==========
      {
        path: "orgs/:orgName",
        lazy: () => import("./pages/org/OrgLayout"),
        loader: orgLoader,
        children: [
          { index: true, lazy: () => import("./pages/org/OrgProfile") },
          { path: "repositories", lazy: () => import("./pages/org/OrgRepos") },
          { path: "teams", lazy: () => import("./pages/org/Teams") },
          { path: "teams/:teamSlug", lazy: () => import("./pages/org/TeamDetail") },
          { path: "people", lazy: () => import("./pages/org/People") },
          { path: "projects", lazy: () => import("./pages/org/Projects") },

          // Org Settings (Owner only)
          {
            path: "settings",
            element: <OrgGuard minRole="owner" />,
            children: [
              {
                lazy: () => import("./pages/org/settings/OrgSettingsLayout"),
                children: [
                  { path: "profile", lazy: () => import("./pages/org/settings/OrgProfile") },
                  { path: "members", lazy: () => import("./pages/org/settings/Members") },
                  { path: "teams", lazy: () => import("./pages/org/settings/ManageTeams") },
                  { path: "security", lazy: () => import("./pages/org/settings/Security") },
                  {
                    path: "billing",
                    element: <OrgGuard minRole="billing" />,
                    children: [
                      { index: true, lazy: () => import("./pages/org/settings/Billing") },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // ========== USER PROFILE (/:username) ==========
      {
        path: ":username",
        lazy: () => import("./pages/user/UserProfile"),
        loader: userProfileLoader,
        children: [
          { index: true, lazy: () => import("./pages/user/Overview") },
          { path: "repositories", lazy: () => import("./pages/user/Repositories") },
          { path: "stars", lazy: () => import("./pages/user/Stars") },
          { path: "followers", lazy: () => import("./pages/user/Followers") },
          { path: "following", lazy: () => import("./pages/user/Following") },
        ],
      },

      // ========== REPOSITORY ROUTES (/:owner/:repo) ==========
      {
        path: ":owner/:repo",
        lazy: () => import("./pages/repo/RepoLayout"),
        loader: repoLoader,
        errorElement: <RepoNotFound />,
        children: [
          // --- Code Tab ---
          { index: true, lazy: () => import("./pages/repo/code/CodeRoot") },

          // ⭐ SPLAT ROUTE — handles arbitrary file/folder paths
          // /user/repo/tree/main/src/components/Header.jsx
          { path: "tree/:branch/*", lazy: () => import("./pages/repo/code/FileTree") },
          { path: "blob/:branch/*", lazy: () => import("./pages/repo/code/FileViewer") },

          // --- Issues Tab ---
          {
            path: "issues",
            lazy: () => import("./pages/repo/issues/IssuesLayout"),
            children: [
              { index: true, lazy: () => import("./pages/repo/issues/IssueList") },
              // /user/repo/issues?state=open&label=bug&assignee=john&sort=newest
              {
                path: "new",
                element: <RepoGuard minPermission="triage" />,
                children: [
                  { index: true, lazy: () => import("./pages/repo/issues/NewIssue") },
                ],
              },
              {
                path: ":issueNumber",
                lazy: () => import("./pages/repo/issues/IssueDetail"),
              },
            ],
          },

          // --- Pull Requests Tab ---
          {
            path: "pulls",
            lazy: () => import("./pages/repo/pulls/PullsLayout"),
            children: [
              { index: true, lazy: () => import("./pages/repo/pulls/PullList") },
              {
                path: ":prNumber",
                lazy: () => import("./pages/repo/pulls/PullDetail"),
                children: [
                  { index: true, lazy: () => import("./pages/repo/pulls/Conversation") },
                  { path: "commits", lazy: () => import("./pages/repo/pulls/Commits") },
                  { path: "files", lazy: () => import("./pages/repo/pulls/FilesChanged") },
                  { path: "checks", lazy: () => import("./pages/repo/pulls/Checks") },
                ],
              },
            ],
          },

          // --- Actions Tab ---
          {
            path: "actions",
            lazy: () => import("./pages/repo/actions/ActionsLayout"),
            children: [
              { index: true, lazy: () => import("./pages/repo/actions/WorkflowRuns") },
              { path: "runs/:runId", lazy: () => import("./pages/repo/actions/RunDetail") },
              { path: "runs/:runId/jobs/:jobId", lazy: () => import("./pages/repo/actions/JobDetail") },
            ],
          },

          // --- Wiki ---
          {
            path: "wiki",
            children: [
              { index: true, lazy: () => import("./pages/repo/wiki/WikiHome") },
              { path: ":pageSlug", lazy: () => import("./pages/repo/wiki/WikiPage") },
              {
                path: ":pageSlug/edit",
                element: <RepoGuard minPermission="write" />,
                children: [
                  { index: true, lazy: () => import("./pages/repo/wiki/EditWikiPage") },
                ],
              },
            ],
          },

          // --- Repo Settings (Admin only) ---
          {
            path: "settings",
            element: <RepoGuard minPermission="admin" />,
            children: [
              {
                lazy: () => import("./pages/repo/settings/RepoSettingsLayout"),
                children: [
                  { path: "general", lazy: () => import("./pages/repo/settings/General") },
                  { path: "collaborators", lazy: () => import("./pages/repo/settings/Collaborators") },
                  { path: "branches", lazy: () => import("./pages/repo/settings/BranchRules") },
                  { path: "webhooks", lazy: () => import("./pages/repo/settings/Webhooks") },
                  { path: "secrets", lazy: () => import("./pages/repo/settings/Secrets") },
                  { path: "danger", lazy: () => import("./pages/repo/settings/DangerZone") },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
```

---

## 🔑 Key Routing Patterns from GitHub

### 1. Splat Route for File Paths
```jsx
// GitHub uses splat routes for file browsing:
// /user/repo/tree/main/src/components/Header.jsx
// /user/repo/blob/main/README.md

function FileTree() {
  const { branch, "*": filePath } = useParams();
  const { owner, repo } = useParams(); // from parent route

  // filePath = "src/components/Header.jsx"
  const pathSegments = filePath ? filePath.split("/") : [];

  return (
    <div>
      <BranchSelector current={branch} />
      <Breadcrumb owner={owner} repo={repo} branch={branch} path={pathSegments} />
      <FileExplorer branch={branch} path={filePath} />
    </div>
  );
}
```

### 2. Tab-Based Repository Navigation
```jsx
// Repo layout with tabs — each tab is a route
function RepoLayout() {
  const { owner, repo } = useParams();
  const repoData = useLoaderData();
  const { permission } = useRepoPermission(owner, repo);

  const tabs = [
    { path: "", label: "Code", icon: "📁" },
    { path: "issues", label: `Issues (${repoData.openIssues})`, icon: "🔴" },
    { path: "pulls", label: `Pull Requests (${repoData.openPRs})`, icon: "🔀" },
    { path: "actions", label: "Actions", icon: "▶️" },
    { path: "wiki", label: "Wiki", icon: "📖" },
    // Only show Settings tab if user has admin access
    ...(permission === "admin"
      ? [{ path: "settings", label: "Settings", icon: "⚙️" }]
      : []),
  ];

  return (
    <div className="repo-layout">
      <RepoHeader repo={repoData} />
      <TabNav tabs={tabs} baseUrl={`/${owner}/${repo}`} />
      <Outlet context={{ repoData, permission }} />
    </div>
  );
}
```

### 3. Issue Filters via URL Search Params
```jsx
// /user/repo/issues?state=open&label=bug&label=urgent&assignee=john&sort=newest&page=2
function IssueList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const issues = useLoaderData();

  const filters = {
    state: searchParams.get("state") || "open",
    labels: searchParams.getAll("label"),
    assignee: searchParams.get("assignee"),
    milestone: searchParams.get("milestone"),
    sort: searchParams.get("sort") || "newest",
    page: Number(searchParams.get("page")) || 1,
  };

  return (
    <div>
      <IssueFilters filters={filters} onChange={setSearchParams} />
      <IssueTable issues={issues} />
      <Pagination current={filters.page} total={issues.totalPages} />
    </div>
  );
}
```

---

## ✅ What You'll Learn

1. **Granular repository permissions** — Read/Triage/Write/Maintain/Admin per repo
2. **Organization-level roles** — Member/Moderator/Owner/Billing
3. **Splat routes** for arbitrary file path navigation (`/tree/main/src/**`)
4. **Tab-based routing** with permission-conditional tabs
5. **Multi-level settings** — User settings, Org settings, Repo settings (all nested)
6. **Deeply nested routes** — Repo → PR → Files Changed → Individual Diff
7. **URL-driven issue filtering** — State, labels, assignees, milestones in URL
8. **Dynamic route generation** based on user permissions (hide/show tabs)

---

## 🎯 Practice Tasks

- [ ] Implement branch switching that updates the `tree/:branch/*` route
- [ ] Build file breadcrumbs from the splat param path segments
- [ ] Add inline code comments on PR file diffs (fetcher-based)
- [ ] Implement "Fork" that creates a copy and navigates to the fork
- [ ] Build the repository transfer flow (multi-step with confirmation)
- [ ] Add code search across repos: `/search?q=useEffect&type=code`
