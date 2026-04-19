
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Root from './components/root'
import DashboardPage from './pages/dashboard'
import SettingPage from './pages/dashboard/setting'
import "./index.css"
import NotFoundPage from './pages/notFound'
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Root />} >
          <Route index element={<div>Home</div>} />

          <Route path='dashboard' element={<DashboardPage />}>
            <Route index element={<div>Dashboard</div>} />
          </Route>
          <Route path='setting' element={<SettingPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
