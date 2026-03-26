# 🎯 Project 13 — CMS with CRUD Operations (Data Router)

## 📊 Difficulty: ⭐⭐⭐ Advanced

---

## 📋 Situation / Use Case

You're building a **Content Management System** where admins create, read, update, and delete articles. All CRUD operations use Data Router `loader`/`action` pattern with React Router's `<Form>` component. Data auto-revalidates after each mutation.

**Client Requirement**: "The CMS should let editors manage articles. Creating and editing should use forms with validation. After saving, the list should automatically refresh. Show appropriate pending states during submissions."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| createBrowserRouter | [`_11_data_routers`](../../_11_data_routers) |
| loader (data fetching) | [`_12_loader`](../../_12_loader) |
| action (CRUD mutations) | [`_13_action`](../../_13_action) |
| useLoaderData | [`_14_useLoaderData`](../../_14_useLoaderData) |
| useActionData (validation) | [`_15_useActionData`](../../_15_useActionData) |
| useFetcher (inline delete) | [`_16_useFetcher`](../../_16_useFetcher) |
| useNavigation (pending) | [`_13_action`](../../_13_action) |
| useRouteError | [`_19_useRouteError`](../../_19_useRouteError) |
| redirect | [`_12_loader`](../../_12_loader) |

---

## 🛣️ Routing Approach

```jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <CMSLayout />,
    errorElement: <CMSError />,
    children: [
      { index: true, element: <Navigate to="/articles" replace /> },
      {
        path: "articles",
        element: <ArticleList />,
        loader: articlesLoader,
      },
      {
        path: "articles/new",
        element: <ArticleForm />,
        action: createArticleAction,
      },
      {
        path: "articles/:articleId",
        element: <ArticleDetail />,
        loader: articleDetailLoader,
        errorElement: <ArticleNotFound />,
      },
      {
        path: "articles/:articleId/edit",
        element: <ArticleForm />,
        loader: articleDetailLoader, // Pre-fill form
        action: updateArticleAction,
      },
      {
        path: "articles/:articleId/delete",
        action: deleteArticleAction,
      },
    ],
  },
]);
```

```jsx
// Actions for CRUD
async function createArticleAction({ request }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const status = formData.get("status");

  const errors = {};
  if (!title || title.trim().length < 3) errors.title = "Title must be at least 3 characters";
  if (!content) errors.content = "Content is required";
  if (Object.keys(errors).length) return { errors };

  const article = await api.createArticle({ title, content, status });
  return redirect(`/articles/${article.id}`);
}

async function updateArticleAction({ request, params }) {
  const formData = await request.formData();
  const errors = validateArticle(formData);
  if (errors) return { errors };

  await api.updateArticle(params.articleId, Object.fromEntries(formData));
  return redirect(`/articles/${params.articleId}`);
}

async function deleteArticleAction({ params }) {
  await api.deleteArticle(params.articleId);
  return redirect("/articles");
}
```

```jsx
// ArticleForm — works for both create and edit
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";

function ArticleForm() {
  const article = useLoaderData();   // undefined for create, data for edit
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post">
      <div>
        <label>Title</label>
        <input name="title" defaultValue={article?.title} />
        {actionData?.errors?.title && <span className="error">{actionData.errors.title}</span>}
      </div>

      <div>
        <label>Content</label>
        <textarea name="content" defaultValue={article?.content} />
        {actionData?.errors?.content && <span className="error">{actionData.errors.content}</span>}
      </div>

      <div>
        <label>Status</label>
        <select name="status" defaultValue={article?.status || "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <button disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : article ? "Update Article" : "Create Article"}
      </button>
    </Form>
  );
}
```

```jsx
// ArticleList — with inline delete using fetcher
import { useLoaderData, useFetcher, Link } from "react-router";

function ArticleList() {
  const articles = useLoaderData();

  return (
    <div>
      <Link to="/articles/new">+ New Article</Link>
      {articles.map((article) => (
        <ArticleRow key={article.id} article={article} />
      ))}
    </div>
  );
}

function ArticleRow({ article }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  return (
    <div className={`article-row ${isDeleting ? "deleting" : ""}`}>
      <Link to={`/articles/${article.id}`}>{article.title}</Link>
      <span>{article.status}</span>
      <Link to={`/articles/${article.id}/edit`}>Edit</Link>
      <fetcher.Form method="delete" action={`/articles/${article.id}/delete`}>
        <button
          type="submit"
          disabled={isDeleting}
          onClick={(e) => {
            if (!confirm("Delete this article?")) e.preventDefault();
          }}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </fetcher.Form>
    </div>
  );
}
```

---

## ✅ What You'll Learn

1. Complete **CRUD operations** with Data Router actions
2. How to build a **shared form** for create and edit (loader pre-fills data)
3. How to use **`useActionData`** for server-side validation errors
4. How **`useFetcher`** enables inline delete without navigation
5. How **auto-revalidation** refreshes the list after mutations
6. How to show **pending states** with `useNavigation`

---

## 🎯 Practice Tasks

- [ ] Add image upload as part of the article form
- [ ] Implement draft/publish toggle with fetcher
- [ ] Add pagination to the article list via search params
- [ ] Implement optimistic delete (hide row immediately)
- [ ] Add a "Revert Changes" button using action data
