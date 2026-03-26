# 🎯 Project 21 — LinkedIn Clone (Professional Social Network)

## 📊 Difficulty: 🔥🔥🔥🔥🔥 Enterprise-Grade

---

## 📋 Situation / Use Case

You're building a **professional social network** like LinkedIn with complex user profiles, connections, job postings, messaging, company pages, and a news feed. The platform has multiple user types (Individual, Recruiter, Company Admin), each with different access levels and routing structures.

**Client Requirement**: "Build a LinkedIn-like platform where:
- Users have rich profiles with tabs (Activity, Experience, Skills, Recommendations)
- Companies have their own pages with admin-only management sections
- Recruiters can post jobs and track applicants
- The feed shows personalized content
- Users can message each other
- Notifications are accessible from any page
- Premium users get extra features (route-gated)
- Everything is deeply linkable — every profile section, every job, every post has a unique URL"

---

## 🧠 Concepts Used

| Concept | Why It's Needed |
|---------|----------------|
| RBAC (Role-Based Access) | Individual vs Recruiter vs Company Admin vs Premium |
| Permission-Based Guards | `can_post_jobs`, `can_view_analytics`, `can_manage_company` |
| Deep Nested Routes | Profile tabs → sub-sections → individual items |
| Modal Routes | Post detail, connection request, job apply — overlay on feed |
| Parallel Routes | Main content + Chat sidebar + Notification panel |
| Dynamic Layouts | Different layouts for Feed vs Profile vs Messaging vs Jobs |
| useSearchParams (heavy) | Job search filters, people search, content filters |
| Data Router (loader/action) | Feed data, profile data, job submission |
| useFetcher | Like/comment/share without navigation, connection requests |
| Lazy Loading | Each major section lazy-loaded |
| useOutletContext | Shared user/auth state across nested routes |
| useMatch | Conditional sidebar, notification badges |

---

## 🏗️ RBAC & Permission System

```jsx
// lib/permissions.js
export const ROLES = {
  INDIVIDUAL: "individual",
  RECRUITER: "recruiter",
  COMPANY_ADMIN: "company_admin",
  PREMIUM: "premium",
  SUPER_ADMIN: "super_admin",
};

export const PERMISSIONS = {
  // Profile
  VIEW_PROFILE: "view_profile",
  EDIT_OWN_PROFILE: "edit_own_profile",
  VIEW_PROFILE_ANALYTICS: "view_profile_analytics",      // Premium
  
  // Jobs
  BROWSE_JOBS: "browse_jobs",
  APPLY_JOBS: "apply_jobs",
  POST_JOBS: "post_jobs",                                  // Recruiter+
  MANAGE_APPLICANTS: "manage_applicants",                  // Recruiter+
  
  // Company
  VIEW_COMPANY: "view_company",
  MANAGE_COMPANY: "manage_company",                        // Company Admin
  MANAGE_COMPANY_JOBS: "manage_company_jobs",              // Company Admin
  VIEW_COMPANY_ANALYTICS: "view_company_analytics",        // Company Admin
  
  // Content
  CREATE_POST: "create_post",
  CREATE_ARTICLE: "create_article",                        // Premium / Influencer
  PROMOTE_POST: "promote_post",                            // Premium+
  
  // Messaging
  SEND_MESSAGE: "send_message",
  SEND_INMAIL: "send_inmail",                              // Premium / Recruiter
  
  // Admin
  MANAGE_USERS: "manage_users",                            // Super Admin
  VIEW_PLATFORM_ANALYTICS: "view_platform_analytics",      // Super Admin
};

// Role → Permissions mapping
export const ROLE_PERMISSIONS = {
  [ROLES.INDIVIDUAL]: [
    "view_profile", "edit_own_profile", "browse_jobs", "apply_jobs",
    "create_post", "send_message", "view_company",
  ],
  [ROLES.PREMIUM]: [
    // Everything Individual has, plus:
    "view_profile_analytics", "create_article", "promote_post",
    "send_inmail",
  ],
  [ROLES.RECRUITER]: [
    // Everything Individual has, plus:
    "post_jobs", "manage_applicants", "send_inmail",
  ],
  [ROLES.COMPANY_ADMIN]: [
    // Everything Recruiter has, plus:
    "manage_company", "manage_company_jobs", "view_company_analytics",
  ],
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS), // All permissions
};
```

```jsx
// guards/PermissionGuard.jsx
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export function PermissionGuard({ requiredPermissions = [], requireAll = true }) {
  const { user, hasPermission } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasAccess = requireAll
    ? requiredPermissions.every((p) => hasPermission(p))
    : requiredPermissions.some((p) => hasPermission(p));

  if (!hasAccess) {
    return <Navigate to="/premium" state={{ 
      requiredPermissions, 
      from: location,
      message: "Upgrade to access this feature" 
    }} replace />;
  }

  return <Outlet />;
}

// Usage in routes:
<Route element={<PermissionGuard requiredPermissions={["post_jobs", "manage_applicants"]} />}>
  <Route path="recruiter/dashboard" element={<RecruiterDashboard />} />
</Route>
```

---

## 🛣️ Routing Architecture

```jsx
const router = createBrowserRouter([
  // ========== PUBLIC ROUTES ==========
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, lazy: () => import("./pages/Landing") },
      { path: "login", lazy: () => import("./pages/auth/Login") },
      { path: "signup", lazy: () => import("./pages/auth/Signup") },
      { path: "forgot-password", lazy: () => import("./pages/auth/ForgotPassword") },
    ],
  },

  // ========== PUBLIC PROFILE (viewable by anyone) ==========
  {
    path: "/in/:username",
    lazy: () => import("./pages/profile/PublicProfile"),
    // /in/ashutosh-kumar (like LinkedIn's URL)
  },

  // ========== COMPANY PAGES (public view) ==========
  {
    path: "/company/:companySlug",
    lazy: () => import("./pages/company/CompanyPublicPage"),
    children: [
      { index: true, lazy: () => import("./pages/company/About") },
      { path: "jobs", lazy: () => import("./pages/company/CompanyJobs") },
      { path: "people", lazy: () => import("./pages/company/People") },
      { path: "posts", lazy: () => import("./pages/company/CompanyPosts") },
    ],
  },

  // ========== AUTHENTICATED APP ==========
  {
    id: "app",
    path: "/",
    lazy: () => import("./layouts/AppLayout"),
    loader: appRootLoader, // Loads user, notifications count, unread messages
    children: [
      // --- Feed ---
      {
        path: "feed",
        lazy: () => import("./pages/feed/Feed"),
        children: [
          // Modal route — post detail opens as overlay on feed
          {
            path: "post/:postId",
            lazy: () => import("./pages/feed/PostDetailModal"),
          },
        ],
      },

      // --- My Network ---
      {
        path: "mynetwork",
        lazy: () => import("./pages/network/MyNetwork"),
        children: [
          { index: true, lazy: () => import("./pages/network/Suggestions") },
          { path: "connections", lazy: () => import("./pages/network/Connections") },
          { path: "invitations", lazy: () => import("./pages/network/Invitations") },
          { path: "people-i-follow", lazy: () => import("./pages/network/Following") },
          { path: "groups", lazy: () => import("./pages/network/Groups") },
          { path: "events", lazy: () => import("./pages/network/Events") },
        ],
      },

      // --- Jobs ---
      {
        path: "jobs",
        lazy: () => import("./pages/jobs/JobsLayout"),
        children: [
          { index: true, lazy: () => import("./pages/jobs/JobSearch") },
          { path: ":jobId", lazy: () => import("./pages/jobs/JobDetail") },
          { path: ":jobId/apply", lazy: () => import("./pages/jobs/JobApply") },
          { path: "saved", lazy: () => import("./pages/jobs/SavedJobs") },
          { path: "applied", lazy: () => import("./pages/jobs/AppliedJobs") },
          { path: "alerts", lazy: () => import("./pages/jobs/JobAlerts") },
        ],
      },

      // --- Messaging ---
      {
        path: "messaging",
        lazy: () => import("./pages/messaging/MessagingLayout"),
        children: [
          { index: true, element: <SelectConversation /> },
          { path: ":conversationId", lazy: () => import("./pages/messaging/Conversation") },
        ],
      },

      // --- Notifications ---
      { path: "notifications", lazy: () => import("./pages/Notifications") },

      // --- Profile (own) ---
      {
        path: "profile",
        lazy: () => import("./pages/profile/ProfileLayout"),
        children: [
          { index: true, lazy: () => import("./pages/profile/Activity") },
          { path: "edit", lazy: () => import("./pages/profile/EditProfile") },
          { path: "experience", lazy: () => import("./pages/profile/Experience") },
          { path: "education", lazy: () => import("./pages/profile/Education") },
          { path: "skills", lazy: () => import("./pages/profile/Skills") },
          { path: "recommendations", lazy: () => import("./pages/profile/Recommendations") },
        ],
      },

      // --- Premium Profile Analytics (PERMISSION GATED) ---
      {
        element: <PermissionGuard requiredPermissions={["view_profile_analytics"]} />,
        children: [
          {
            path: "profile/analytics",
            lazy: () => import("./pages/profile/ProfileAnalytics"),
          },
          {
            path: "profile/who-viewed",
            lazy: () => import("./pages/profile/WhoViewedProfile"),
          },
        ],
      },

      // --- Search ---
      {
        path: "search",
        lazy: () => import("./pages/search/SearchLayout"),
        children: [
          { path: "results/all", lazy: () => import("./pages/search/AllResults") },
          { path: "results/people", lazy: () => import("./pages/search/PeopleResults") },
          { path: "results/jobs", lazy: () => import("./pages/search/JobResults") },
          { path: "results/companies", lazy: () => import("./pages/search/CompanyResults") },
          { path: "results/posts", lazy: () => import("./pages/search/PostResults") },
          { path: "results/groups", lazy: () => import("./pages/search/GroupResults") },
        ],
      },
      // URL: /search/results/people?keywords=react&network=first&location=india

      // ========== RECRUITER ROUTES (PERMISSION GATED) ==========
      {
        path: "recruiter",
        element: <PermissionGuard requiredPermissions={["post_jobs", "manage_applicants"]} />,
        children: [
          {
            lazy: () => import("./pages/recruiter/RecruiterLayout"),
            children: [
              { path: "dashboard", lazy: () => import("./pages/recruiter/Dashboard") },
              { path: "post-job", lazy: () => import("./pages/recruiter/PostJob") },
              { path: "posted-jobs", lazy: () => import("./pages/recruiter/PostedJobs") },
              {
                path: "posted-jobs/:jobId",
                lazy: () => import("./pages/recruiter/JobManagement"),
                children: [
                  { index: true, lazy: () => import("./pages/recruiter/Applicants") },
                  { path: "applicants/:applicantId", lazy: () => import("./pages/recruiter/ApplicantDetail") },
                  { path: "analytics", lazy: () => import("./pages/recruiter/JobAnalytics") },
                ],
              },
              { path: "talent-search", lazy: () => import("./pages/recruiter/TalentSearch") },
              {
                path: "inmail",
                element: <PermissionGuard requiredPermissions={["send_inmail"]} />,
                children: [
                  { index: true, lazy: () => import("./pages/recruiter/InMailComposer") },
                ],
              },
            ],
          },
        ],
      },

      // ========== COMPANY ADMIN ROUTES (PERMISSION GATED) ==========
      {
        path: "company-admin/:companySlug",
        element: <PermissionGuard requiredPermissions={["manage_company"]} />,
        children: [
          {
            lazy: () => import("./pages/companyAdmin/AdminLayout"),
            children: [
              { path: "dashboard", lazy: () => import("./pages/companyAdmin/Dashboard") },
              { path: "page-editor", lazy: () => import("./pages/companyAdmin/PageEditor") },
              { path: "jobs", lazy: () => import("./pages/companyAdmin/ManageJobs") },
              { path: "followers", lazy: () => import("./pages/companyAdmin/Followers") },
              {
                path: "analytics",
                element: <PermissionGuard requiredPermissions={["view_company_analytics"]} />,
                children: [
                  { index: true, lazy: () => import("./pages/companyAdmin/VisitorAnalytics") },
                  { path: "content", lazy: () => import("./pages/companyAdmin/ContentAnalytics") },
                  { path: "followers", lazy: () => import("./pages/companyAdmin/FollowerAnalytics") },
                ],
              },
              { path: "team", lazy: () => import("./pages/companyAdmin/TeamAccess") },
            ],
          },
        ],
      },

      // ========== SUPER ADMIN (PLATFORM) ==========
      {
        path: "admin",
        element: <PermissionGuard requiredPermissions={["manage_users", "view_platform_analytics"]} />,
        children: [
          {
            lazy: () => import("./pages/admin/AdminLayout"),
            children: [
              { path: "dashboard", lazy: () => import("./pages/admin/Dashboard") },
              { path: "users", lazy: () => import("./pages/admin/UserManagement") },
              { path: "users/:userId", lazy: () => import("./pages/admin/UserDetail") },
              { path: "reports", lazy: () => import("./pages/admin/ContentReports") },
              { path: "analytics", lazy: () => import("./pages/admin/PlatformAnalytics") },
            ],
          },
        ],
      },

      // --- Settings ---
      {
        path: "settings",
        lazy: () => import("./pages/settings/SettingsLayout"),
        children: [
          { path: "account", lazy: () => import("./pages/settings/Account") },
          { path: "privacy", lazy: () => import("./pages/settings/Privacy") },
          { path: "notifications", lazy: () => import("./pages/settings/NotificationPrefs") },
          { path: "visibility", lazy: () => import("./pages/settings/Visibility") },
          { path: "data-privacy", lazy: () => import("./pages/settings/DataPrivacy") },
        ],
      },

      // --- Premium Upsell ---
      { path: "premium", lazy: () => import("./pages/Premium") },
    ],
  },
]);
```

---

## 🔑 Key Routing Patterns from LinkedIn

### 1. Modal Routes on Feed
```jsx
// When user clicks a post on the feed, it opens as a modal
// URL changes to /feed/post/123 but feed stays visible behind
function Feed() {
  const location = useLocation();
  
  return (
    <div>
      <FeedList />
      {/* Post modal renders here if URL matches */}
      <Outlet />
    </div>
  );
}

function PostDetailModal() {
  const { postId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="modal-overlay" onClick={() => navigate("/feed")}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <PostDetail postId={postId} />
      </div>
    </div>
  );
}
```

### 2. Search with Multi-Category Results
```jsx
// /search/results/people?keywords=react+developer&network=first&location=india&industry=tech
function PeopleResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const loaderData = useLoaderData(); // Search results from loader

  return (
    <div>
      <FilterPills
        keywords={searchParams.get("keywords")}
        network={searchParams.get("network")}
        location={searchParams.get("location")}
        industry={searchParams.get("industry")}
        onRemoveFilter={(key) => {
          setSearchParams((prev) => { prev.delete(key); return prev; });
        }}
      />
      <SearchResults results={loaderData.results} />
    </div>
  );
}
```

### 3. Connection Request (Fetcher — No Navigation)
```jsx
function ConnectButton({ userId }) {
  const fetcher = useFetcher();
  const isPending = fetcher.state !== "idle";
  
  // Optimistic UI
  const isConnected = fetcher.formData
    ? fetcher.formData.get("action") === "connect"
    : false;

  return (
    <fetcher.Form method="post" action="/api/connections">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="action" value="connect" />
      <button disabled={isPending}>
        {isPending ? "Sending..." : isConnected ? "Pending" : "Connect"}
      </button>
    </fetcher.Form>
  );
}
```

### 4. Premium Feature Gating
```jsx
// When non-premium user tries to access premium feature:
// → Redirect to /premium with context about what they tried to access
// → After purchasing, redirect back to the original feature

function Premium() {
  const location = useLocation();
  const from = location.state?.from?.pathname;
  const feature = location.state?.requiredPermissions;

  return (
    <div>
      <h1>Upgrade to Premium</h1>
      {from && <p>Unlock access to {from}</p>}
      <PremiumPlans onPurchase={() => navigate(from || "/feed")} />
    </div>
  );
}
```

---

## ✅ What You'll Learn

1. **RBAC + Permission System** — Roles (Individual/Recruiter/Admin) + fine-grained permissions
2. **Modal route pattern** — Posts open as modals on feed (URL changes, feed stays)
3. **Multi-category search** — Tabbed search results with URL-driven filters
4. **Premium feature gating** — Redirect to upsell with return-to-feature flow
5. **Company admin scoping** — Admin routes scoped to specific company slugs
6. **Parallel UI panels** — Feed + Chat sidebar + Notifications all routed simultaneously
7. **LinkedIn URL patterns** — `/in/:username`, `/company/:slug`, `/jobs/:jobId`

---

## 🎯 Practice Tasks

- [ ] Implement "Who Viewed Your Profile" with premium gating
- [ ] Build the "People Also Viewed" sidebar with fetcher-loaded data
- [ ] Add profile completeness score that updates as sections are filled
- [ ] Implement endorsed skills with fetcher (endorse without navigation)
- [ ] Build the notification dropdown that marks as read via fetcher
- [ ] Add "Share Profile" that generates a clean public URL
