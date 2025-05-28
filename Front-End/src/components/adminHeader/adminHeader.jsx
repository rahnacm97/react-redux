import React from 'react'
import './adminHeader.css'
import { useNavigate } from 'react-router-dom'
function AdminHeader() {
    const navigate = useNavigate()
        const handleLogout = ()=>{
        localStorage.removeItem('admin')
        localStorage.removeItem('token')
        navigate('/admin/login')
      }
  return (
    <>
    <header className="dashboard-header">
            <h2>Admin Panel</h2>
            <div className="header-right">
              <div className="admin-profile">
                <button className='btn-logout' onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </header>
    </>
  )
}

export default AdminHeader