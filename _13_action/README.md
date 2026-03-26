# 📌 13 - action (Route Data Mutations)

## 🔗 Official Docs
- [Actions](https://reactrouter.com/start/data/custom)

---

## 📖 What is an action?

An `action` is a function defined on a route that handles **data mutations** (POST, PUT, DELETE). It's the counterpart to `loader` — while loaders READ data, actions WRITE data.

> ⚠️ **Only available with Data Routers** (`createBrowserRouter`)

---

## 1️⃣ Basic Action with Form

```jsx
import { Form, useActionData, redirect } from "react-router";

// Define the action
async function createContactAction({ request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");

  const contact = await createContact({ name, email });
  return redirect(`/contacts/${contact.id}`);
}

// Route config
const router = createBrowserRouter([
  {
    path: "/contacts/new",
    element: <NewContact />,
    action: createContactAction,
  },
]);

// Component with React Router's <Form>
function NewContact() {
  return (
    <Form method="post">
      <input name="name" placeholder="Name" />
      <input name="email" placeholder="Email" />
      <button type="submit">Create</button>
    </Form>
  );
}
```

---

## 2️⃣ Action with Validation Errors

```jsx
async function createUserAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // Validate
  const errors = {};
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  if (password && password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };  // Return errors to the component
  }

  await createUser({ email, password });
  return redirect("/dashboard");
}

// Component
function SignUp() {
  const actionData = useActionData();

  return (
    <Form method="post">
      <div>
        <input name="email" placeholder="Email" />
        {actionData?.errors?.email && (
          <p className="error">{actionData.errors.email}</p>
        )}
      </div>
      <div>
        <input name="password" type="password" />
        {actionData?.errors?.password && (
          <p className="error">{actionData.errors.password}</p>
        )}
      </div>
      <button type="submit">Sign Up</button>
    </Form>
  );
}
```

---

## 3️⃣ Action Arguments

```jsx
async function myAction({ request, params }) {
  // request — contains form data, method, URL
  const formData = await request.formData();
  const method = request.method; // "POST", "PUT", "DELETE"
  
  // params — dynamic route segments
  const { userId } = params;

  return { success: true };
}
```

| Argument | Type | Description |
|----------|------|-------------|
| `request` | Request | Contains formData, method, URL |
| `params` | object | Dynamic route parameters |

---

## 4️⃣ Different HTTP Methods

```jsx
async function contactAction({ request, params }) {
  const formData = await request.formData();

  switch (request.method) {
    case "POST":
      return await createContact(formData);
    case "PUT":
      return await updateContact(params.contactId, formData);
    case "DELETE":
      await deleteContact(params.contactId);
      return redirect("/contacts");
    default:
      throw new Response("Method not allowed", { status: 405 });
  }
}

// In the component:
function Contact() {
  return (
    <div>
      {/* PUT - Update */}
      <Form method="put">
        <input name="name" defaultValue="John" />
        <button type="submit">Update</button>
      </Form>

      {/* DELETE */}
      <Form method="delete">
        <button type="submit">Delete</button>
      </Form>
    </div>
  );
}
```

---

## 5️⃣ React Router `<Form>` vs HTML `<form>`

| Feature | `<Form>` (React Router) | `<form>` (HTML) |
|---------|:-----------------------:|:---------------:|
| Page reload | ❌ No reload | ✅ Full reload |
| Calls action | ✅ Route action | ❌ Server endpoint |
| Pending states | ✅ Via `useNavigation` | ❌ |
| Client-side | ✅ | ❌ |

---

## 6️⃣ Pending State with useNavigation

```jsx
import { Form, useNavigation } from "react-router";

function CreatePost() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post">
      <input name="title" />
      <textarea name="content" />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Post"}
      </button>
    </Form>
  );
}
```

---

## 🧠 Key Points to Remember

1. Actions handle **data mutations** (create, update, delete)
2. **Only works** with Data Routers and React Router's `<Form>` component
3. Use `useActionData()` to access data returned from actions (like validation errors)
4. Use `redirect()` to navigate after successful mutations
5. The `request.method` tells you the HTTP method (POST, PUT, DELETE)
6. Use `formData.get("fieldName")` to access form values
7. After an action completes, React Router **automatically revalidates** loaders
