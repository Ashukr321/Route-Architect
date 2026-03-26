# 🎯 Project 17 — Analytics Dashboard with Complex Filters

## 📊 Difficulty: ⭐⭐⭐⭐ Advanced-Expert

---

## 📋 Situation / Use Case

You're building an **analytics dashboard** (like Google Analytics / Mixpanel) where every filter, date range, metric, and comparison is stored in the URL. Users can share dashboards with exact filter states via URL.

**Client Requirement**: "Every filter should be in the URL so users can bookmark, share, and reload without losing state. The dashboard should support multiple date ranges, metric comparisons, and segment filters — all URL-driven."

---

## 🧠 Concepts Used

| Concept | Folder Reference |
|---------|-----------------|
| useSearchParams (heavy) | [`_07_useSearchParams`](../../_07_useSearchParams) |
| createBrowserRouter | [`_11_data_routers`](../../_11_data_routers) |
| loader (data from URL) | [`_12_loader`](../../_12_loader) |
| useLoaderData | [`_14_useLoaderData`](../../_14_useLoaderData) |
| Nested Routes | [`_08_outlet_and_nested_routes`](../../_08_outlet_and_nested_routes) |
| useNavigate (preserve params) | [`_04_useNavigate`](../../_04_useNavigate) |
| useLocation | [`_06_useLocation`](../../_06_useLocation) |
| Lazy Loading | [`_22_lazy_loading_routes`](../../_22_lazy_loading_routes) |

---

## 🛣️ Routing Approach

```jsx
const router = createBrowserRouter([
  {
    path: "/analytics",
    element: <AnalyticsLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="overview" replace />,
      },
      {
        path: "overview",
        element: <OverviewDashboard />,
        loader: overviewLoader,
      },
      {
        path: "traffic",
        element: <TrafficAnalytics />,
        loader: trafficLoader,
      },
      {
        path: "conversions",
        element: <ConversionAnalytics />,
        loader: conversionLoader,
      },
      {
        path: "reports/:reportId",
        element: <CustomReport />,
        loader: customReportLoader,
      },
    ],
  },
]);
```

```jsx
// Every loader reads filters from URL
async function overviewLoader({ request }) {
  const url = new URL(request.url);

  // Parse all URL params
  const params = {
    dateFrom: url.searchParams.get("from") || "2026-01-01",
    dateTo: url.searchParams.get("to") || "2026-03-27",
    granularity: url.searchParams.get("granularity") || "day",
    metrics: url.searchParams.getAll("metric"),    // Multiple values
    segments: url.searchParams.getAll("segment"),
    compareFrom: url.searchParams.get("compareFrom"),
    compareTo: url.searchParams.get("compareTo"),
    region: url.searchParams.get("region") || "all",
  };

  const data = await api.getAnalytics(params);
  return { data, params };
}
```

```jsx
// Complex filter management with useSearchParams
function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilter = (key, value) => {
    setSearchParams((prev) => {
      if (value === null || value === undefined) {
        prev.delete(key);
      } else {
        prev.set(key, value);
      }
      return prev;
    });
  };

  const toggleMetric = (metric) => {
    setSearchParams((prev) => {
      const current = prev.getAll("metric");
      if (current.includes(metric)) {
        prev.delete("metric");
        current.filter((m) => m !== metric).forEach((m) => prev.append("metric", m));
      } else {
        prev.append("metric", metric);
      }
      return prev;
    });
  };

  const setDateRange = (from, to) => {
    setSearchParams((prev) => {
      prev.set("from", from);
      prev.set("to", to);
      return prev;
    });
  };

  const enableComparison = (from, to) => {
    setSearchParams((prev) => {
      prev.set("compareFrom", from);
      prev.set("compareTo", to);
      return prev;
    });
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  // URL example:
  // /analytics/overview?from=2026-01-01&to=2026-03-27&granularity=week
  //   &metric=pageviews&metric=users&segment=mobile&region=us

  return (
    <div className="filter-bar">
      <DateRangePicker
        from={searchParams.get("from")}
        to={searchParams.get("to")}
        onChange={setDateRange}
      />
      <GranularitySelector
        value={searchParams.get("granularity") || "day"}
        onChange={(v) => updateFilter("granularity", v)}
      />
      <MetricToggles
        active={searchParams.getAll("metric")}
        onToggle={toggleMetric}
      />
      <button onClick={clearAllFilters}>Clear Filters</button>
    </div>
  );
}
```

---

## ✅ What You'll Learn

1. How to manage **complex, multi-value search params** (`getAll`)
2. How loaders read **all filter state from the URL** (`request.url`)
3. How to build **shareable, bookmarkable dashboards** via URL state
4. How to handle **multi-value params** (append/delete patterns)
5. How to build a **filter bar** that controls the entire page via URL
6. Production-level **analytics URL architecture**

---

## 🎯 Practice Tasks

- [ ] Save filter presets as named URLs
- [ ] Add CSV export with current filters applied
- [ ] Implement comparison mode (two date ranges side by side)
- [ ] Add real-time update toggle (polling interval)
- [ ] Build a "Share Dashboard" feature that copies the URL
