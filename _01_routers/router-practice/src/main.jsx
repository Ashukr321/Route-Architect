import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)


//Router are top level component that provide the routing context to our whole applications 
// 3 main routers 
// BrowserRouter // default many web application use this routers 
// HashRouter
// MemoryRouter 

// Routes is the container that wrapped all the route 
// route define the mapping between url path and component 
  // 1.  index route 
  // render into parent  <outlet/> at the parent url  like a default child 

  
