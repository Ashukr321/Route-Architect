# 🎯 Project 25 — LeetCode/HackerRank Clone (Coding Platform)

## 📊 Difficulty: 🔥🔥🔥🔥🔥 Enterprise-Grade

---

## 📋 Situation / Use Case

You're building a **competitive coding platform** like LeetCode/HackerRank with problem sets, an online code editor, contests, user progress tracking, discussion forums, and premium content gating. The platform supports multiple user roles including students, problem setters, contest organizers, and admins.

**Client Requirement**: "Build a coding platform where:
- Users browse problems filtered by difficulty, topic, status (solved/unsolved), and company tags
- The coding workspace has split panes (problem description, code editor, test results) — all URL-driven
- Contests have registration, timed access, live leaderboard, and post-contest editorial routes
- Users have profiles with submission history, contest ratings, progress heatmaps
- Premium users get access to company-specific problem sets, video explanations, and hints
- Problem setters have their own dashboard to create/edit problems with test cases
- Discussion forum threads are linked to specific problems
- The platform tracks streaks, badges, and learning paths"

---

## 🧠 RBAC & Permission System

```jsx
export const PLATFORM_ROLES = {
  FREE_USER: "free_user",
  PREMIUM_USER: "premium_user",
  PROBLEM_SETTER: "problem_setter",
  CONTEST_ORGANIZER: "contest_organizer",
  MODERATOR: "moderator",
  ADMIN: "admin",
};

export const PERMISSIONS = {
  // Problem Access
  VIEW_FREE_PROBLEMS: "view_free_problems",
  VIEW_PREMIUM_PROBLEMS: "view_premium_problems",
  VIEW_COMPANY_PROBLEMS: "view_company_problems",
  VIEW_HINTS: "view_hints",
  VIEW_VIDEO_SOLUTIONS: "view_video_solutions",
  VIEW_EDITORIAL: "view_editorial",

  // Submissions
  SUBMIT_CODE: "submit_code",
  VIEW_ALL_SUBMISSIONS: "view_all_submissions",     // See others' submissions

  // Problem Management
  CREATE_PROBLEM: "create_problem",
  EDIT_PROBLEM: "edit_problem",
  MANAGE_TEST_CASES: "manage_test_cases",
  PUBLISH_PROBLEM: "publish_problem",

  // Contest
  JOIN_CONTEST: "join_contest",
  CREATE_CONTEST: "create_contest",
  MANAGE_CONTEST: "manage_contest",

  // Moderation
  MODERATE_DISCUSSIONS: "moderate_discussions",
  BAN_USERS: "ban_users",
  VIEW_REPORTS: "view_reports",

  // Admin
  MANAGE_SITE: "manage_site",
  VIEW_ANALYTICS: "view_analytics",
  MANAGE_PLANS: "manage_plans",
};

// Problem access checker — combines role + subscription + problem type
function useProblemAccess(problem) {
  const { user, hasPermission } = useAuth();

  const canAccess = () => {
    if (problem.isFree) return true;
    if (problem.isPremium && !hasPermission("view_premium_problems")) return false;
    if (problem.companyTag && !hasPermission("view_company_problems")) return false;
    return true;
  };

  return {
    canAccess: canAccess(),
    canViewHints: hasPermission("view_hints"),
    canViewEditorial: problem.isFree || hasPermission("view_editorial"),
    canViewVideoSolution: hasPermission("view_video_solutions"),
    needsPremium: !canAccess() && !user?.isPremium,
  };
}
```

---

## 🛣️ Routing Architecture

```jsx
const router = createBrowserRouter([
  // ========== PUBLIC ==========
  {
    path: "/",
    lazy: () => import("./layouts/MainLayout"),
    loader: mainLoader,
    children: [
      { index: true, lazy: () => import("./pages/Home") },

      // ====== PROBLEMS ======
      {
        path: "problems",
        lazy: () => import("./pages/problems/ProblemsLayout"),
        children: [
          {
            index: true,
            lazy: () => import("./pages/problems/ProblemList"),
            loader: problemListLoader,
            // /problems?difficulty=medium&topic=arrays&topic=dynamic-programming
            // &status=unsolved&company=google&sort=acceptance&page=3
          },
          {
            path: "tag/:tagSlug",
            lazy: () => import("./pages/problems/TagProblems"),
            loader: tagProblemsLoader,
            // /problems/tag/binary-search
          },
        ],
      },

      // ====== PROBLEM WORKSPACE (The Core Experience) ======
      {
        path: "problems/:problemSlug",
        lazy: () => import("./pages/workspace/WorkspaceLayout"),
        loader: problemLoader,
        children: [
          // Default — Description tab
          {
            index: true,
            lazy: () => import("./pages/workspace/Description"),
          },
          // Editorial (Premium-gated for premium problems)
          {
            path: "editorial",
            lazy: () => import("./pages/workspace/Editorial"),
            loader: editorialLoader, // Checks premium access in loader
          },
          // Solutions / Discussions
          {
            path: "solutions",
            lazy: () => import("./pages/workspace/Solutions"),
            children: [
              { index: true, lazy: () => import("./pages/workspace/SolutionList") },
              { path: ":solutionId", lazy: () => import("./pages/workspace/SolutionDetail") },
            ],
          },
          // Submissions
          {
            path: "submissions",
            element: <AuthGuard />,
            children: [
              { index: true, lazy: () => import("./pages/workspace/SubmissionList") },
              { path: ":submissionId", lazy: () => import("./pages/workspace/SubmissionDetail") },
            ],
          },
          // Hints
          {
            path: "hints",
            lazy: () => import("./pages/workspace/Hints"),
            // Shows hints if premium, upsell if free user
          },
        ],
      },

      // ====== CONTESTS ======
      {
        path: "contests",
        lazy: () => import("./pages/contests/ContestsLayout"),
        children: [
          { index: true, lazy: () => import("./pages/contests/ContestList") },
          {
            path: ":contestId",
            lazy: () => import("./pages/contests/ContestLayout"),
            loader: contestLoader,
            children: [
              { index: true, lazy: () => import("./pages/contests/ContestInfo") },
              {
                path: "register",
                element: <AuthGuard />,
                children: [
                  { index: true, lazy: () => import("./pages/contests/Register") },
                ],
              },
              {
                // Contest problems — only accessible during contest time!
                path: "problem/:problemIndex",
                element: <ContestTimeGuard />, // Checks if contest is live
                children: [
                  {
                    lazy: () => import("./pages/contests/ContestProblem"),
                  },
                ],
              },
              {
                path: "leaderboard",
                lazy: () => import("./pages/contests/Leaderboard"),
                // /contests/weekly-350/leaderboard?page=1&region=india
              },
              {
                // Post-contest editorials — only after contest ends
                path: "editorial",
                element: <ContestEndedGuard />,
                children: [
                  { index: true, lazy: () => import("./pages/contests/ContestEditorial") },
                ],
              },
            ],
          },
        ],
      },

      // ====== STUDY PLANS / LEARNING PATHS ======
      {
        path: "study-plan",
        lazy: () => import("./pages/study/StudyPlanLayout"),
        children: [
          { index: true, lazy: () => import("./pages/study/PlanList") },
          {
            path: ":planSlug",
            lazy: () => import("./pages/study/PlanDetail"),
            loader: planLoader,
            children: [
              { index: true, lazy: () => import("./pages/study/PlanOverview") },
              { path: "day/:dayNumber", lazy: () => import("./pages/study/DayProblems") },
            ],
          },
        ],
      },

      // ====== DISCUSS (Forum) ======
      {
        path: "discuss",
        lazy: () => import("./pages/discuss/DiscussLayout"),
        children: [
          {
            index: true,
            lazy: () => import("./pages/discuss/TopicList"),
            // /discuss?category=general&sort=hot&page=1
          },
          { path: "new", element: <AuthGuard />, children: [{ index: true, lazy: () => import("./pages/discuss/NewTopic") }] },
          {
            path: ":topicId",
            lazy: () => import("./pages/discuss/TopicDetail"),
            children: [
              { path: "reply/:replyId", lazy: () => import("./pages/discuss/ReplyDetail") },
            ],
          },
        ],
      },

      // ====== USER PROFILE ======
      {
        path: "u/:username",
        lazy: () => import("./pages/user/ProfileLayout"),
        loader: userProfileLoader,
        children: [
          { index: true, lazy: () => import("./pages/user/Overview") },
          { path: "submissions", lazy: () => import("./pages/user/Submissions") },
          { path: "solutions", lazy: () => import("./pages/user/SharedSolutions") },
          { path: "contests", lazy: () => import("./pages/user/ContestHistory") },
          { path: "badges", lazy: () => import("./pages/user/Badges") },
          { path: "progress", lazy: () => import("./pages/user/Progress") },
        ],
      },

      // ====== EXPLORE (Company-wise, Topic-wise) ======
      { path: "explore", lazy: () => import("./pages/Explore") },
      {
        path: "company/:companySlug",
        lazy: () => import("./pages/company/CompanyProblems"),
        loader: companyProblemsLoader,
        // /company/google?frequency=6months&difficulty=hard
      },

      // ====== PREMIUM ======
      { path: "premium", lazy: () => import("./pages/Premium") },
    ],
  },

  // ========== PROBLEM SETTER PORTAL ==========
  {
    path: "/setter",
    element: <PermissionGuard requiredPermissions={["create_problem"]} />,
    children: [
      {
        lazy: () => import("./pages/setter/SetterLayout"),
        children: [
          { path: "dashboard", lazy: () => import("./pages/setter/Dashboard") },
          { path: "problems", lazy: () => import("./pages/setter/MyProblems") },
          {
            path: "problems/new",
            lazy: () => import("./pages/setter/CreateProblem"),
            children: [
              { path: "details", lazy: () => import("./pages/setter/ProblemDetails") },
              { path: "description", lazy: () => import("./pages/setter/ProblemDescription") },
              { path: "test-cases", lazy: () => import("./pages/setter/TestCases") },
              { path: "solution", lazy: () => import("./pages/setter/AuthorSolution") },
              { path: "editorial", lazy: () => import("./pages/setter/WriteEditorial") },
              { path: "preview", lazy: () => import("./pages/setter/Preview") },
            ],
          },
          { path: "problems/:problemId/edit", lazy: () => import("./pages/setter/EditProblem") },
        ],
      },
    ],
  },

  // ========== CONTEST ORGANIZER ==========
  {
    path: "/organizer",
    element: <PermissionGuard requiredPermissions={["create_contest"]} />,
    children: [
      {
        lazy: () => import("./pages/organizer/OrganizerLayout"),
        children: [
          { path: "dashboard", lazy: () => import("./pages/organizer/Dashboard") },
          { path: "contests/new", lazy: () => import("./pages/organizer/CreateContest") },
          { path: "contests/:contestId/manage", lazy: () => import("./pages/organizer/ManageContest") },
          { path: "contests/:contestId/analytics", lazy: () => import("./pages/organizer/ContestAnalytics") },
        ],
      },
    ],
  },

  // ========== ADMIN ==========
  {
    path: "/admin",
    element: <PermissionGuard requiredPermissions={["manage_site"]} />,
    children: [
      {
        lazy: () => import("./pages/admin/AdminLayout"),
        children: [
          { path: "dashboard", lazy: () => import("./pages/admin/Dashboard") },
          { path: "users", lazy: () => import("./pages/admin/Users") },
          { path: "problems", lazy: () => import("./pages/admin/ProblemModeration") },
          { path: "contests", lazy: () => import("./pages/admin/ContestManagement") },
          { path: "reports", lazy: () => import("./pages/admin/Reports") },
          { path: "analytics", lazy: () => import("./pages/admin/Analytics") },
          { path: "plans", lazy: () => import("./pages/admin/SubscriptionPlans") },
          {
            path: "moderation",
            element: <PermissionGuard requiredPermissions={["moderate_discussions"]} />,
            children: [
              { index: true, lazy: () => import("./pages/admin/ContentModeration") },
            ],
          },
        ],
      },
    ],
  },

  // Auth
  { path: "/login", lazy: () => import("./pages/auth/Login") },
  { path: "/signup", lazy: () => import("./pages/auth/Signup") },
]);
```

---

## 🔑 Key Routing Patterns from LeetCode

### 1. Time-Gated Contest Routes
```jsx
// ContestTimeGuard — problems are only accessible during contest
function ContestTimeGuard() {
  const { contestId } = useParams();
  const contest = useRouteLoaderData("contest");
  const now = new Date();

  if (now < new Date(contest.startTime)) {
    return <ContestNotStarted contest={contest} />;
  }
  if (now > new Date(contest.endTime)) {
    return <Navigate to={`/contests/${contestId}/editorial`} replace />;
  }

  return <Outlet />;
}
```

### 2. Problem Workspace Split View
```jsx
// The workspace URL determines which panel is shown
// /problems/two-sum → Description + Editor + Console
// /problems/two-sum/editorial → Editorial + Editor
// /problems/two-sum/solutions → Community Solutions list
// /problems/two-sum/submissions → My Submissions

function WorkspaceLayout() {
  const problem = useLoaderData();
  const { canAccess, needsPremium } = useProblemAccess(problem);

  if (!canAccess) return <PremiumUpsell problem={problem} />;

  return (
    <div className="workspace">
      <div className="left-panel">
        <ProblemTabs problemSlug={problem.slug} />
        <Outlet context={{ problem }} />
      </div>
      <div className="right-panel">
        <CodeEditor problem={problem} />
        <TestConsole />
      </div>
    </div>
  );
}
```

### 3. Premium Content Gating in Loader
```jsx
async function editorialLoader({ params, request }) {
  const user = await getUser(request);
  const problem = await api.getProblem(params.problemSlug);

  if (problem.isPremium && !user?.isPremium) {
    return { locked: true, problem };
  }

  const editorial = await api.getEditorial(problem.id);
  return { locked: false, editorial, problem };
}

function Editorial() {
  const { locked, editorial, problem } = useLoaderData();

  if (locked) {
    return (
      <div className="premium-wall">
        <h2>🔒 Premium Content</h2>
        <p>Subscribe to access editorials for this problem</p>
        <Link to="/premium" state={{ from: `/problems/${problem.slug}/editorial` }}>
          Unlock with Premium
        </Link>
      </div>
    );
  }

  return <EditorialContent content={editorial} />;
}
```

### 4. Code Submission (Fetcher — No Navigation)
```jsx
function CodeEditor({ problem }) {
  const fetcher = useFetcher();
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    fetcher.submit(
      { code, language: "javascript", problemId: problem.id },
      { method: "post", action: "/api/submit" }
    );
  };

  return (
    <div>
      <MonacoEditor value={code} onChange={setCode} />
      <div className="actions">
        <button onClick={() => fetcher.submit(
          { code, problemId: problem.id },
          { method: "post", action: "/api/run" }
        )}>
          ▶ Run
        </button>
        <button onClick={handleSubmit} disabled={fetcher.state === "submitting"}>
          {fetcher.state === "submitting" ? "Judging..." : "Submit"}
        </button>
      </div>
      {fetcher.data?.results && <TestResults results={fetcher.data.results} />}
    </div>
  );
}
```

---

## ✅ What You'll Learn

1. **Content-level premium gating** — Free vs Premium problems, hints, editorials
2. **Time-gated routes** — Contest problems accessible only during contest window
3. **Split-pane workspace** — Problem tabs (left) + Code editor (right), URL-driven
4. **Problem setter workflow** — Multi-step problem creation with validation
5. **Contest lifecycle routing** — Registration → Live → Leaderboard → Editorial
6. **Submission without navigation** — Run/Submit code using `useFetcher`
7. **Complex multi-filter search** — difficulty, topic, company, status in URL
8. **User progress tracking** — Heatmap, badges, streaks as profile routes
9. **Four-portal architecture** — User, Problem Setter, Contest Organizer, Admin

---

## 🎯 Practice Tasks

- [ ] Build the submission status page with real-time polling (Accepted/TLE)
- [ ] Implement the daily challenge route that changes every day
- [ ] Add study plan progress tracking with streak detection
- [ ] Build the leaderboard with pagination and region filtering
- [ ] Implement code playground share (generate shareable URL for code)
- [ ] Add company-wise problem frequency sorting

---

## 🏆 FINAL MASTERY CHECK

After completing projects 21-25, you can now architect routing for:

| Platform Type | Example | You Can Build It ✅ |
|--------------|---------|:-------------------:|
| Social Network | LinkedIn, Twitter | ✅ |
| Code Platform | GitHub, GitLab | ✅ |
| Cloud Storage | Google Drive, Dropbox | ✅ |
| E-Commerce | Amazon, Flipkart | ✅ |
| Coding Platform | LeetCode, HackerRank | ✅ |
| Any SaaS Product | Any complex web app | ✅ |

**You now have the thought process to architect routing for ANY web application at ANY scale! 🚀**
