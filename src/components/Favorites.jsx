import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [authState, setAuthState] = useState('checking')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        setUser(session?.user ?? null)
        setAuthState(session ? 'authenticated' : 'unauthenticated')
      } catch (err) {
        console.error('Auth error:', err)
        setError(err.message)
        setAuthState('error')
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setAuthState(session ? 'authenticated' : 'unauthenticated')
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          recipe_id,
          recipes (
            *,
            tags (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFavorites(data.map(fav => fav.recipes))
    } catch (err) {
      console.error('Error fetching favorites:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (recipeId) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId)

      if (error) throw error
      setFavorites(favorites.filter(recipe => recipe.id !== recipeId))
    } catch (err) {
      console.error('Error removing favorite:', err)
      setError(err.message)
    }
  }

  if (authState === 'checking') {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (authState === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-4">Please log in to view favorites</h2>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.href = '/auth'}
        >
          Go to Login
        </button>
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
        <h1 className="text-3xl font-bold">Favorite Recipes</h1>
        <p className="text-base-content/70 mt-2">
          Your collection of favorite recipes
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center p-8 bg-base-200 rounded-lg">
          <p className="text-lg">You haven't favorited any recipes yet</p>
          <p className="text-base-content/70 mt-2">
            Click the heart icon on any recipe to add it to your favorites
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(recipe => (
            <div key={recipe.id} className="card bg-base-100 shadow-xl">
              <figure className="relative h-48">
                <img 
                  src={recipe.image_url} 
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <button 
                    className="btn btn-circle btn-sm btn-error"
                    onClick={() => toggleFavorite(recipe.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </figure>
              <div className="card-body">
                <h2 className="card-title">{recipe.name}</h2>
                <div className="flex flex-wrap gap-2 mb-2">
                  <div className="badge badge-outline">
                    {recipe.difficulty}
                  </div>
                  <div className="badge badge-outline">
                    {recipe.mode_of_prep}
                  </div>
                  <div className="badge badge-outline">
                    {recipe.prep_time + recipe.cook_time} min
                  </div>
                </div>
                <div className="card-actions justify-end">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setSelectedRecipe(recipe)
                      setShowViewModal(true)
                    }}
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites 