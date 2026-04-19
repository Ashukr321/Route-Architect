import React from 'react'
import { Outlet } from 'react-router-dom'

const Root = () => {
  return (
    <div style={{display:"flex",}}>
      <div style={{minWidth:"80px", borderRight:"1px solid gray",height:"100vh"}}>sidebar</div>
      
      <main style={{flex:1,}}>
        {/* header */}
        <header style={{borderBottom:"1px solid gray"}}>
            
            <div className="header_nav" style={{display:"flex",justifyContent:"space-between",gap:"20px",padding:"4px 20px"}}>
              {/* logo */}
              <div style={{width:"20%"}}>
                <p>logo</p>
              </div>

              {/* searchbar */}
              <div style={{flex:1}}>
                <input type="text" placeholder="Search..." style={{width:"50%"}} />
              </div>

              <div>
                <ul style={{display:"flex",gap:"10px",listStyle:"none"}}>
                  <li>Home</li>
                  <li>profile</li>
                  <li>setting</li>
                </ul>
              </div>

            </div>
        </header>
        <div style={{padding:"10px"}}>

        <Outlet/>
        </div>
      </main>
    </div>
  )
}

export default Root
