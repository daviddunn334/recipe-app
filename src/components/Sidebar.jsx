import { Link, useLocation } from 'react-router-dom'

function Sidebar() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/recipes', label: 'Recipes', icon: '📝' },
    { path: '/meal-plan', label: 'Meal Plan', icon: '📅' },
    { path: '/shopping-list', label: 'Shopping List', icon: '🛒' },
    { path: '/favorites', label: 'Favorites', icon: '❤️' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ]

  return (
    <div className="w-64 bg-base-200 h-screen fixed left-0 top-0 p-4">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>🥄</span>
            Two Spoons
          </h1>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-lg ${
                    location.pathname === item.path
                      ? 'bg-primary text-primary-content'
                      : 'hover:bg-base-300'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar 