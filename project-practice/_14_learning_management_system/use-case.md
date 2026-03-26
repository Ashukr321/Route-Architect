# 🎯 Project 14 — Learning Management System (LMS)

## 📊 Difficulty: ⭐⭐⭐⭐ Advanced

---

## 📋 Situation / Use Case

You're building an **LMS platform** (like Udemy/Coursera) where students browse courses, enroll, and track progress through lessons. Each lesson has its own URL. Progress is saved and the sidebar shows completed/incomplete lessons.

**Client Requirement**: "Students should navigate courses with a lesson sidebar. Track completion per lesson. Resume from last incomplete lesson. Instructors have a separate dashboard to manage their courses."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| Deep Nested Routes | [`_08_outlet_and_nested_routes`](../../_08_outlet_and_nested_routes) |
| useParams (courseId, lessonId) | [`_05_useParams`](../../_05_useParams) |
| useOutletContext | [`_17_useOutletContext`](../../_17_useOutletContext) |
| useSearchParams (filters) | [`_07_useSearchParams`](../../_07_useSearchParams) |
| Protected Routes (role) | [`_20_protected_routes`](../../_20_protected_routes) |
| loader (course data) | [`_12_loader`](../../_12_loader) |
| action (mark complete) | [`_13_action`](../../_13_action) |
| useFetcher (progress) | [`_16_useFetcher`](../../_16_useFetcher) |
| Lazy Loading | [`_22_lazy_loading_routes`](../../_22_lazy_loading_routes) |
| Error Boundaries | [`_21_error_boundaries`](../../_21_error_boundaries) |

---

## 🛣️ Routing Approach

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <GlobalError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "courses", element: <CoursesCatalog />, loader: coursesLoader },
      { path: "courses/:courseId", element: <CourseDetail />, loader: courseDetailLoader },
      
      // Enrolled course — learning view
      {
        path: "learn/:courseId",
        element: <CoursePlayerLayout />,
        loader: coursePlayerLoader,
        children: [
          { index: true, element: <CourseOverview /> },
          {
            path: "module/:moduleId/lesson/:lessonId",
            element: <LessonViewer />,
            loader: lessonLoader,
            action: markCompleteAction,
          },
          { path: "quiz/:quizId", element: <QuizPage />, loader: quizLoader, action: submitQuizAction },
          { path: "certificate", element: <Certificate />, loader: certificateLoader },
        ],
      },

      // Student dashboard
      { path: "my-courses", element: <MyCourses />, loader: myCoursesLoader },

      // Instructor routes
      {
        path: "instructor",
        element: <RoleGuard allowedRoles={["instructor", "admin"]} />,
        children: [
          { path: "dashboard", element: <InstructorDashboard />, loader: instructorDashLoader },
          { path: "courses/:courseId/edit", element: <CourseEditor />, loader: courseEditorLoader, action: saveCourseAction },
        ],
      },
    ],
  },
]);
```

```jsx
// CoursePlayerLayout — sidebar with lessons + video/content area
function CoursePlayerLayout() {
  const course = useLoaderData();
  const [progress, setProgress] = useState(course.progress);

  return (
    <div className="course-player">
      <CourseSidebar course={course} progress={progress} />
      <main className="lesson-area">
        <Outlet context={{ course, progress, setProgress }} />
      </main>
    </div>
  );
}

// LessonViewer — mark complete with fetcher
function LessonViewer() {
  const lesson = useLoaderData();
  const { progress, setProgress } = useOutletContext();
  const fetcher = useFetcher();
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();

  const isComplete = progress.completedLessons.includes(lessonId);

  const handleMarkComplete = () => {
    fetcher.submit(
      { lessonId, action: "markComplete" },
      { method: "post" }
    );
    // Optimistic update
    setProgress((prev) => ({
      ...prev,
      completedLessons: [...prev.completedLessons, lessonId],
    }));
  };

  const goToNextLesson = () => {
    const nextLesson = getNextLesson(course, moduleId, lessonId);
    if (nextLesson) {
      navigate(`/learn/${courseId}/module/${nextLesson.moduleId}/lesson/${nextLesson.id}`);
    }
  };

  return (
    <div>
      <video src={lesson.videoUrl} controls />
      <h1>{lesson.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
      
      <div className="lesson-actions">
        {!isComplete && (
          <button onClick={handleMarkComplete}>✅ Mark as Complete</button>
        )}
        <button onClick={goToNextLesson}>Next Lesson →</button>
      </div>
    </div>
  );
}
```

---

## ✅ What You'll Learn

1. How to build a **course player** with sidebar navigation and content area
2. How to use **multiple nested params** (courseId, moduleId, lessonId)
3. How to implement **progress tracking** with optimistic UI via `useFetcher`
4. How to combine **role-based access** (student vs instructor routes)
5. How to pass **shared state** (progress) through `useOutletContext`
6. Production-level **data loading patterns** for educational platforms

---

## 🎯 Practice Tasks

- [ ] Add a "Resume Last Lesson" button on the course overview
- [ ] Implement a quiz scoring system with action
- [ ] Generate a completion certificate route
- [ ] Add course reviews with a form action
- [ ] Implement lazy loading for heavy lesson content
