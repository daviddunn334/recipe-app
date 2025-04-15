import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { User, Mail, Calendar, Settings, LogOut, ChefHat, ShoppingCart } from 'lucide-react'

function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    recipes: 0,
    mealPlans: 0,
    shoppingLists: 0
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        // Fetch user stats
        const { data: recipes } = await supabase
          .from('recipes')
          .select('id')
          .eq('user_id', user.id)
        
        const { data: mealPlans } = await supabase
          .from('meal_plans')
          .select('id')
          .eq('user_id', user.id)
        
        const { data: shoppingLists } = await supabase
          .from('shopping_lists')
          .select('id')
          .eq('user_id', user.id)
        
        setStats({
          recipes: recipes?.length || 0,
          mealPlans: mealPlans?.length || 0,
          shoppingLists: shoppingLists?.length || 0
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error: {error}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="avatar placeholder">
              <div className="bg-emerald-600 text-white rounded-full w-24 h-24 flex items-center justify-center">
                <span className="text-3xl">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-base-content mb-2">{user?.email}</h1>
          <p className="text-lg text-base-content/70">
            Member since {new Date(user?.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-base-100 p-6 rounded-lg shadow-md border border-base-200">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600 mb-4">
              <ChefHat size={24} />
            </div>
            <h3 className="text-xl font-semibold text-base-content text-center">{stats.recipes}</h3>
            <p className="text-base-content/70 text-center">Recipes</p>
          </div>
          <div className="bg-base-100 p-6 rounded-lg shadow-md border border-base-200">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600 mb-4">
              <Calendar size={24} />
            </div>
            <h3 className="text-xl font-semibold text-base-content text-center">{stats.mealPlans}</h3>
            <p className="text-base-content/70 text-center">Meal Plans</p>
          </div>
          <div className="bg-base-100 p-6 rounded-lg shadow-md border border-base-200">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600 mb-4">
              <ShoppingCart size={24} />
            </div>
            <h3 className="text-xl font-semibold text-base-content text-center">{stats.shoppingLists}</h3>
            <p className="text-base-content/70 text-center">Shopping Lists</p>
          </div>
        </div>

        {/* Account Details Section */}
        <div className="bg-base-100 rounded-lg shadow-md border border-base-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-base-content mb-6">Account Details</h2>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-base-200 rounded-lg">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-base-content/70">Email</h3>
                  <p className="text-base-content">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-base-200 rounded-lg">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-base-content/70">Account Created</h3>
                  <p className="text-base-content">{new Date(user?.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-base-200 rounded-lg">
                <div className="flex-shrink-0">
                  <Settings className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-base-content/70">Account Type</h3>
                  <p className="text-base-content">Free Account</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                className="btn btn-error gap-2"
                onClick={async () => {
                  try {
                    const { error } = await supabase.auth.signOut()
                    if (error) throw error
                  } catch (err) {
                    console.error('Error signing out:', err)
                  }
                }}
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 