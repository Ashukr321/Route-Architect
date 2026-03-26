# 📌 16 - useFetcher Hook

## 🔗 Official Docs
- [useFetcher](https://reactrouter.com/start/data/custom)

---

## 📖 What is useFetcher?

`useFetcher` allows you to interact with **loaders and actions** without navigating. It's perfect for:
- Inline form submissions (like a "favorite" button)
- Loading data without changing the URL
- Multiple simultaneous submissions

> ⚠️ **Only available with Data Routers** (`createBrowserRouter`)

---

## 1️⃣ Basic Usage — Submitting Without Navigation

```jsx
import { useFetcher } from "react-router";

function FavoriteButton({ contact }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" action={`/contacts/${contact.id}/favorite`}>
      <button type="submit" name="favorite" value={contact.favorite ? "false" : "true"}>
        {contact.favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
```

> 💡 Unlike `<Form>`, `<fetcher.Form>` does **not cause a navigation** — the URL stays the same!

---

## 2️⃣ Fetcher State (Loading / Submitting)

```jsx
function NewsletterSignup() {
  const fetcher = useFetcher();

  const isSubmitting = fetcher.state === "submitting";
  const isLoading = fetcher.state === "loading";
  const isIdle = fetcher.state === "idle";

  return (
    <fetcher.Form method="post" action="/api/newsletter">
      <input name="email" placeholder="Enter email" />
      <button disabled={isSubmitting}>
        {isSubmitting ? "Subscribing..." : "Subscribe"}
      </button>
      
      {fetcher.data?.success && isIdle && (
        <p className="success">🎉 Subscribed successfully!</p>
      )}
      
      {fetcher.data?.error && isIdle && (
        <p className="error">{fetcher.data.error}</p>
      )}
    </fetcher.Form>
  );
}
```

---

## 3️⃣ Fetcher for Loading Data (fetcher.load)

```jsx
import { useFetcher } from "react-router";
import { useEffect } from "react";

function CitySearch() {
  const fetcher = useFetcher();

  const handleSearch = (query) => {
    fetcher.load(`/api/cities?q=${query}`);
  };

  return (
    <div>
      <input
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search cities..."
      />

      {fetcher.state === "loading" && <p>Loading...</p>}

      {fetcher.data && (
        <ul>
          {fetcher.data.map((city) => (
            <li key={city.id}>{city.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## 4️⃣ Fetcher for Inline Editing

```jsx
function EditableField({ contactId, fieldName, value }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="put" action={`/contacts/${contactId}`}>
      <input
        name={fieldName}
        defaultValue={value}
        onBlur={(e) => {
          if (e.target.value !== value) {
            fetcher.submit(e.target.form);
          }
        }}
      />
      {fetcher.state === "submitting" && <span>Saving...</span>}
    </fetcher.Form>
  );
}
```

---

## 5️⃣ Optimistic UI with Fetcher

```jsx
function TodoItem({ todo }) {
  const fetcher = useFetcher();

  // Optimistic: show the intended state immediately
  const isCompleted = fetcher.formData
    ? fetcher.formData.get("completed") === "true"
    : todo.completed;

  return (
    <fetcher.Form method="put" action={`/todos/${todo.id}`}>
      <label style={{ textDecoration: isCompleted ? "line-through" : "none" }}>
        <input
          type="checkbox"
          name="completed"
          value={isCompleted ? "false" : "true"}
          checked={isCompleted}
          onChange={(e) => fetcher.submit(e.target.form)}
        />
        {todo.title}
      </label>
    </fetcher.Form>
  );
}
```

---

## 6️⃣ Fetcher Submit Programmatically

```jsx
function DeleteButton({ itemId }) {
  const fetcher = useFetcher();

  const handleDelete = () => {
    if (window.confirm("Are you sure?")) {
      fetcher.submit(
        { intent: "delete" },
        { method: "delete", action: `/items/${itemId}` }
      );
    }
  };

  return (
    <button onClick={handleDelete} disabled={fetcher.state !== "idle"}>
      {fetcher.state === "submitting" ? "Deleting..." : "Delete"}
    </button>
  );
}
```

---

## 📊 Fetcher Properties

| Property | Type | Description |
|----------|------|-------------|
| `fetcher.state` | `"idle" \| "loading" \| "submitting"` | Current state |
| `fetcher.data` | any | Data from loader/action |
| `fetcher.formData` | FormData | Submitted form data |
| `fetcher.Form` | Component | Form that doesn't navigate |
| `fetcher.load(url)` | function | Load data from a URL |
| `fetcher.submit(data, options)` | function | Submit data programmatically |

---

## 📊 Form vs fetcher.Form

| Feature | `<Form>` | `<fetcher.Form>` |
|---------|:--------:|:----------------:|
| Navigation | ✅ Navigates | ❌ Stays on page |
| URL change | ✅ | ❌ |
| Pending state | Via `useNavigation` | Via `fetcher.state` |
| Multiple at once | ❌ One at a time | ✅ Multiple |

---

## 🧠 Key Points to Remember

1. `useFetcher` interacts with loaders/actions **without navigation**
2. `fetcher.Form` submits like `<Form>` but **doesn't change the URL**
3. `fetcher.load()` fetches loader data **on demand**
4. `fetcher.submit()` submits data **programmatically**
5. `fetcher.state` tracks `idle`, `loading`, `submitting`
6. You can have **multiple fetchers** on one page — great for lists with inline actions
7. Perfect for **optimistic UI**, **autocomplete**, **favorites**, **inline edits**
