import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeController from './ThemeController'
import { FaSignOutAlt } from 'react-icons/fa'

const TopNav = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Integrity Specialists</a>
      </div>
      <div className="flex-none gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {user?.email}
          </span>
          <button 
            onClick={handleLogout}
            className="btn btn-ghost btn-sm"
            title="Logout"
          >
            <FaSignOutAlt className="text-lg" />
          </button>
        </div>
        <ThemeController />
      </div>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path> </svg>
        </button>
      </div>
    </div>
  )
}

export default TopNav