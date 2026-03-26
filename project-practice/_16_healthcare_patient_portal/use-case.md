# 🎯 Project 16 — Healthcare Patient Portal

## 📊 Difficulty: ⭐⭐⭐⭐ Advanced

---

## 📋 Situation / Use Case

You're building a **healthcare patient portal** where patients view appointments, medical records, prescriptions, and lab results. Doctors access a different dashboard. All routes are strictly secured, and access is based on relationship (patients only see their own data).

**Client Requirement**: "Patients access their records at `/patient/dashboard`. Doctors access theirs at `/doctor/dashboard`. Each patient's record is at `/patient/records/:recordId`. Security is critical — no one should access another patient's data."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| Role-Based Protected Routes | [`_20_protected_routes`](../../_20_protected_routes) |
| Data Routers + loader | [`_11_data_routers`](../../_11_data_routers) / [`_12_loader`](../../_12_loader) |
| action (appointments) | [`_13_action`](../../_13_action) |
| useLoaderData | [`_14_useLoaderData`](../../_14_useLoaderData) |
| useRouteError | [`_19_useRouteError`](../../_19_useRouteError) |
| Error Boundaries | [`_21_error_boundaries`](../../_21_error_boundaries) |
| Layout Routes | [`_08_outlet_and_nested_routes`](../../_08_outlet_and_nested_routes) |
| useNavigate + state | [`_04_useNavigate`](../../_04_useNavigate) |
| Lazy Loading | [`_22_lazy_loading_routes`](../../_22_lazy_loading_routes) |
| Navigate (redirects) | [`_09_navigate_redirect`](../../_09_navigate_redirect) |

---

## 🛣️ Routing Approach

```jsx
const router = createBrowserRouter([
  // Public routes
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login />, action: loginAction },

  // Patient Portal
  {
    path: "/patient",
    element: <RoleGuard role="patient"><PatientLayout /></RoleGuard>,
    loader: patientDataLoader,
    errorElement: <PatientError />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <PatientDashboard />, loader: patientDashLoader },
      { path: "appointments", element: <Appointments />, loader: appointmentsLoader },
      { path: "appointments/book", element: <BookAppointment />, action: bookAppointmentAction },
      { path: "records", element: <MedicalRecords />, loader: recordsLoader },
      { path: "records/:recordId", element: <RecordDetail />, loader: recordDetailLoader },
      { path: "prescriptions", element: <Prescriptions />, loader: prescriptionsLoader },
      { path: "lab-results", element: <LabResults />, loader: labResultsLoader },
      { path: "lab-results/:resultId", element: <LabResultDetail />, loader: labResultDetailLoader },
      { path: "profile", element: <PatientProfile />, loader: profileLoader, action: updateProfileAction },
    ],
  },

  // Doctor Portal
  {
    path: "/doctor",
    element: <RoleGuard role="doctor"><DoctorLayout /></RoleGuard>,
    children: [
      { path: "dashboard", element: <DoctorDashboard />, loader: doctorDashLoader },
      { path: "patients", element: <PatientList />, loader: patientListLoader },
      { path: "patients/:patientId", element: <PatientChart />, loader: patientChartLoader },
      { path: "schedule", element: <DoctorSchedule />, loader: scheduleLoader },
    ],
  },
]);
```

```jsx
// Security — loader verifies ownership
async function recordDetailLoader({ params, request }) {
  const user = await requireAuth(request);
  const record = await api.getRecord(params.recordId);

  // Ensure patient can only view their OWN records
  if (user.role === "patient" && record.patientId !== user.id) {
    throw new Response("Access Denied", { status: 403 });
  }

  return record;
}

// Book Appointment action
async function bookAppointmentAction({ request }) {
  const formData = await request.formData();
  const errors = {};

  const doctorId = formData.get("doctorId");
  const date = formData.get("date");
  const reason = formData.get("reason");

  if (!doctorId) errors.doctorId = "Please select a doctor";
  if (!date) errors.date = "Please select a date";
  if (!reason) errors.reason = "Please provide a reason";

  if (Object.keys(errors).length) return { errors };

  const appointment = await api.bookAppointment({ doctorId, date, reason });
  return redirect(`/patient/appointments?booked=${appointment.id}`);
}
```

---

## ✅ What You'll Learn

1. How to build **domain-specific secured routing** (healthcare compliance)
2. How to implement **ownership-based access control** in loaders
3. How to create **separate portals** for different user types
4. How to use **actions** for booking/scheduling workflows
5. How to handle **sensitive data** routing patterns
6. Production-level **HIPAA-aware route architecture**

---

## 🎯 Practice Tasks

- [ ] Add two-factor auth flow before accessing sensitive records
- [ ] Implement appointment cancellation with confirmation action
- [ ] Add print/download route for medical records
- [ ] Create doctor-patient messaging route
- [ ] Add emergency access override for admins with audit logging
