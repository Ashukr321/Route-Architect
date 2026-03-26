# 📌 15 - useActionData Hook

## 🔗 Official Docs
- [useActionData](https://reactrouter.com/start/data/custom)

---

## 📖 What is useActionData?

`useActionData` returns the **data returned from the route's `action`** function. It's commonly used to display validation errors or success messages after form submissions.

> ⚠️ **Only available with Data Routers** (`createBrowserRouter`)

---

## 1️⃣ Basic Usage — Validation Errors

```jsx
import { Form, useActionData, redirect } from "react-router";

// Action function
async function loginAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // Validation
  const errors = {};
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const result = await authenticate(email, password);
  if (!result.success) {
    return { errors: { form: "Invalid credentials" } };
  }

  return redirect("/dashboard");
}

// Component
function Login() {
  const actionData = useActionData();

  return (
    <Form method="post">
      {actionData?.errors?.form && (
        <p className="error">{actionData.errors.form}</p>
      )}

      <div>
        <label>Email</label>
        <input name="email" type="email" />
        {actionData?.errors?.email && (
          <span className="error">{actionData.errors.email}</span>
        )}
      </div>

      <div>
        <label>Password</label>
        <input name="password" type="password" />
        {actionData?.errors?.password && (
          <span className="error">{actionData.errors.password}</span>
        )}
      </div>

      <button type="submit">Login</button>
    </Form>
  );
}
```

---

## 2️⃣ Success Messages

```jsx
async function feedbackAction({ request }) {
  const formData = await request.formData();
  const message = formData.get("message");

  if (!message || message.trim().length === 0) {
    return { error: "Message cannot be empty" };
  }

  await submitFeedback(message);
  return { success: true, message: "Thank you for your feedback!" };
}

function FeedbackForm() {
  const actionData = useActionData();

  return (
    <div>
      {actionData?.success && (
        <div className="success-banner">{actionData.message}</div>
      )}

      <Form method="post">
        <textarea name="message" />
        {actionData?.error && <p className="error">{actionData.error}</p>}
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
```

---

## 3️⃣ Combined with useNavigation (Pending States)

```jsx
import { Form, useActionData, useNavigation } from "react-router";

function ContactForm() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post">
      <input name="name" />
      {actionData?.errors?.name && <p>{actionData.errors.name}</p>}

      <input name="email" />
      {actionData?.errors?.email && <p>{actionData.errors.email}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Contact"}
      </button>
    </Form>
  );
}
```

---

## 4️⃣ useActionData is undefined initially

```jsx
function MyForm() {
  const actionData = useActionData();
  // Initially: actionData === undefined
  // After form submit: actionData = { whatever action returned }

  return (
    <Form method="post">
      {/* Only show errors after the first submission */}
      {actionData !== undefined && actionData.errors && (
        <div className="errors">
          {Object.values(actionData.errors).map((err) => (
            <p key={err}>{err}</p>
          ))}
        </div>
      )}
      <input name="field" />
      <button>Submit</button>
    </Form>
  );
}
```

---

## 📊 Lifecycle Flow

```
User fills form → Clicks submit → <Form method="post">
                                        ↓
                                   action() runs
                                        ↓
                        ┌──────────────────────────────────┐
                        │  Returns errors?                  │
                        │  → useActionData() = { errors }   │
                        │  → Component re-renders            │
                        │                                    │
                        │  Returns redirect()?               │
                        │  → User navigates to new page      │
                        │  → useActionData() = undefined     │
                        └──────────────────────────────────┘
```

---

## 🧠 Key Points to Remember

1. `useActionData` returns data from the **current route's action**
2. It's `undefined` **before** any form submission
3. Most commonly used for **validation errors** and **success messages**
4. After `redirect()`, action data is **not available** on the new page
5. Combine with `useNavigation` for **pending/submitting states**
6. Only works with React Router's `<Form>` component, not plain `<form>`
