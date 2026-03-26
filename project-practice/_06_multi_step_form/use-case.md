# 🎯 Project 06 — Multi-Step Form Wizard

## 📊 Difficulty: ⭐⭐ Intermediate

---

## 📋 Situation / Use Case

You're building a **multi-step form** (wizard) for user onboarding. Each step has its own URL, users can navigate forward/backward, and form data persists across steps. The progress bar shows which step they're on.

**Client Requirement**: "The onboarding should have 4 steps: Personal Info → Address → Preferences → Review. Users can go back to previous steps. If they refresh, they should stay on the same step."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| Nested Routes | [`_08_outlet_and_nested_routes`](../../_08_outlet_and_nested_routes) |
| Outlet + Context | [`_17_useOutletContext`](../../_17_useOutletContext) |
| useNavigate | [`_04_useNavigate`](../../_04_useNavigate) |
| useLocation | [`_06_useLocation`](../../_06_useLocation) |
| Navigate (redirect) | [`_09_navigate_redirect`](../../_09_navigate_redirect) |
| useParams | [`_05_useParams`](../../_05_useParams) |

---

## 🏗️ Project Setup

```bash
npm create vite@latest multi-step-form -- --template react
cd multi-step-form
npm install react-router
npm run dev
```

---

## 📁 Folder Structure

```
src/
├── App.jsx
├── pages/
│   └── onboarding/
│       ├── OnboardingLayout.jsx    # Wizard wrapper with progress bar
│       ├── StepPersonal.jsx        # Step 1
│       ├── StepAddress.jsx         # Step 2
│       ├── StepPreferences.jsx     # Step 3
│       ├── StepReview.jsx          # Step 4
│       └── OnboardingComplete.jsx
├── components/
│   ├── ProgressBar.jsx
│   └── StepNavigation.jsx
```

---

## 🛣️ Routing Approach

```jsx
// App.jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/onboarding" element={<OnboardingLayout />}>
        <Route index element={<Navigate to="personal" replace />} />
        <Route path="personal" element={<StepPersonal />} />
        <Route path="address" element={<StepAddress />} />
        <Route path="preferences" element={<StepPreferences />} />
        <Route path="review" element={<StepReview />} />
      </Route>
      <Route path="/onboarding/complete" element={<OnboardingComplete />} />
    </Routes>
  );
}
```

```jsx
// pages/onboarding/OnboardingLayout.jsx
import { Outlet, useLocation } from "react-router";
import { useState } from "react";
import ProgressBar from "../../components/ProgressBar";

const STEPS = [
  { path: "personal", label: "Personal Info" },
  { path: "address", label: "Address" },
  { path: "preferences", label: "Preferences" },
  { path: "review", label: "Review" },
];

function OnboardingLayout() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    // Step 1
    name: "", email: "", phone: "",
    // Step 2
    street: "", city: "", state: "", zip: "",
    // Step 3
    newsletter: false, theme: "light", language: "en",
  });

  const currentStep = STEPS.findIndex((s) =>
    location.pathname.endsWith(s.path)
  );

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="wizard">
      <ProgressBar steps={STEPS} currentStep={currentStep} />
      <div className="wizard-content">
        <Outlet context={{ formData, updateFormData, STEPS, currentStep }} />
      </div>
    </div>
  );
}
```

```jsx
// pages/onboarding/StepPersonal.jsx
import { useOutletContext } from "react-router";
import StepNavigation from "../../components/StepNavigation";

function StepPersonal() {
  const { formData, updateFormData } = useOutletContext();

  return (
    <div>
      <h2>Step 1: Personal Information</h2>
      <input
        value={formData.name}
        onChange={(e) => updateFormData({ name: e.target.value })}
        placeholder="Full Name"
      />
      <input
        value={formData.email}
        onChange={(e) => updateFormData({ email: e.target.value })}
        placeholder="Email"
      />
      <input
        value={formData.phone}
        onChange={(e) => updateFormData({ phone: e.target.value })}
        placeholder="Phone"
      />
      <StepNavigation nextPath="../address" />
    </div>
  );
}
```

```jsx
// components/StepNavigation.jsx
import { useNavigate } from "react-router";

function StepNavigation({ prevPath, nextPath, onSubmit }) {
  const navigate = useNavigate();

  return (
    <div className="step-nav">
      {prevPath && (
        <button onClick={() => navigate(prevPath)}>← Previous</button>
      )}
      {nextPath && (
        <button onClick={() => navigate(nextPath)}>Next →</button>
      )}
      {onSubmit && (
        <button onClick={onSubmit}>Submit ✓</button>
      )}
    </div>
  );
}
```

---

## ✅ What You'll Learn

1. How to **share form state** across steps using `useOutletContext`
2. How to use **nested routes** to represent wizard steps
3. How to build a **progress bar** based on URL location
4. How to use **relative navigation** (`../address`) in nested routes
5. How to **redirect** index route to first step with `<Navigate>`

---

## 🎯 Practice Tasks

- [ ] Add form validation before allowing "Next"
- [ ] Save form state to localStorage for persistence on refresh
- [ ] Prevent users from skipping steps (guard each step)
- [ ] Add animations when transitioning between steps
- [ ] Show a confirmation modal on the Review step before submission
