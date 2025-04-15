import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-base-content/70 mt-2">
          Manage your account settings
        </p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-6">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-16">
                <span className="text-xl">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div>
              <h2 className="card-title">{user?.email}</h2>
              <p className="text-sm text-base-content/70">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="divider"></div>

          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered" 
                value={user?.email || ''}
                disabled
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Account Created</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered" 
                value={new Date(user?.created_at).toLocaleString() || ''}
                disabled
              />
            </div>
          </div>

          <div className="card-actions justify-end mt-6">
            <button 
              className="btn btn-error"
              onClick={async () => {
                try {
                  const { error } = await supabase.auth.signOut()
                  if (error) throw error
                } catch (err) {
                  console.error('Error signing out:', err)
                }
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 