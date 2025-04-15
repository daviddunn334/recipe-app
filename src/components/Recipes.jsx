import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'

function Recipes() {
  const [recipes, setRecipes] = useState([])
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [authState, setAuthState] = useState('checking')
  const [recipeToDelete, setRecipeToDelete] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const fileInputRef = useRef(null)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [favorites, setFavorites] = useState([])

  const [newRecipe, setNewRecipe] = useState({
    name: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'Easy',
    modeOfPrep: 'Stove Top',
    type: 'Dinner',
    ingredients: [],
    instructions: '',
    image_url: ''
  })

  const [newIngredient, setNewIngredient] = useState({
    name: '',
    amount: ''
  })

  const difficulties = ['Easy', 'Medium', 'Hard']
  const modesOfPrep = ['Grill', 'Stove Top', 'Oven', 'All of the above']
  const recipeTypes = ['Breakfast', 'Lunch', 'Dinner', 'Dessert']

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('Session:', session) // Debug log
        if (error) throw error
        setUser(session?.user ?? null)
        setAuthState(session ? 'authenticated' : 'unauthenticated')
      } catch (err) {
        console.error('Auth error:', err) // Debug log
        setError(err.message)
        setAuthState('error')
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session) // Debug log
      setUser(session?.user ?? null)
      setAuthState(session ? 'authenticated' : 'unauthenticated')
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      fetchRecipes()
      fetchFavorites()
    }
  }, [user])

  useEffect(() => {
    if (recipes.length > 0) {
      filterRecipes()
    }
  }, [searchQuery, selectedDifficulty, recipes])

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          *,
          ingredients (*),
          tags (*)
        `)
        .order('created_at', { ascending: false })

      if (recipesError) throw recipesError

      setRecipes(recipesData)
    } catch (err) {
      console.error('Fetch recipes error:', err) // Debug log
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterRecipes = () => {
    let filtered = [...recipes]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(recipe => {
        const nameMatch = recipe.name.toLowerCase().includes(query)
        const ingredientMatch = recipe.ingredients?.some(ing => 
          ing.name.toLowerCase().includes(query)
        )
        const tagMatch = recipe.tags?.some(tag => 
          tag.name.toLowerCase().includes(query)
        )
        return nameMatch || ingredientMatch || tagMatch
      })
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(recipe => 
        recipe.difficulty === selectedDifficulty
      )
    }

    setFilteredRecipes(filtered)
  }

  const handleAddIngredient = () => {
    if (newIngredient.name.trim() === '') return

    setNewRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { ...newIngredient, id: Date.now() }]
    }))
    setNewIngredient({ name: '', amount: '' })
  }

  const handleRemoveIngredient = (id) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing.id !== id)
    }))
  }

  const handleImageUpload = async (event) => {
    try {
      setUploadingImage(true)
      const file = event.target.files[0]
      
      if (!file) {
        setError('Please select an image to upload')
        return
      }

      // Create preview URL
      setPreviewImage(URL.createObjectURL(file))

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filePath)

      // Update the newRecipe state with the image URL
      setNewRecipe(prev => ({
        ...prev,
        image_url: publicUrl
      }))

    } catch (err) {
      console.error('Image upload error:', err)
      setError(err.message)
      setPreviewImage(null)
    } finally {
      setUploadingImage(false)
    }
  }

  const resetForm = () => {
    setNewRecipe({
      name: '',
      prepTime: '',
      cookTime: '',
      servings: '',
      difficulty: 'Easy',
      modeOfPrep: 'Stove Top',
      type: 'Dinner',
      ingredients: [],
      instructions: '',
      image_url: ''
    })
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAddRecipe = async () => {
    try {
      if (!user) {
        setError('You must be logged in to add recipes')
        return
      }

      if (newRecipe.name.trim() === '') {
        setError('Please enter a recipe name')
        return
      }

      // Use a placeholder image if none is provided
      const imageUrl = newRecipe.image_url || 'https://placehold.co/600x400?text=No+Image'

      const recipeData = {
        name: newRecipe.name,
        prep_time: newRecipe.prepTime,
        cook_time: newRecipe.cookTime,
        servings: parseInt(newRecipe.servings),
        difficulty: newRecipe.difficulty,
        mode_of_prep: newRecipe.modeOfPrep,
        type: newRecipe.type,
        instructions: newRecipe.instructions,
        image_url: imageUrl,
        user_id: user.id
      }

      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert([recipeData])
        .select()
        .single()

      if (recipeError) throw recipeError

      // Add ingredients
      if (newRecipe.ingredients.length > 0) {
        const ingredientsToInsert = newRecipe.ingredients.map(ing => ({
          name: ing.name,
          amount: ing.amount,
          recipe_id: recipe.id
        }))

        const { error: ingredientsError } = await supabase
          .from('ingredients')
          .insert(ingredientsToInsert)

        if (ingredientsError) throw ingredientsError
      }

      // Add type as a tag
      const { error: tagError } = await supabase
        .from('tags')
        .insert([{
          name: newRecipe.type.toLowerCase(),
          recipe_id: recipe.id
        }])

      if (tagError) throw tagError

      resetForm()
      setShowAddModal(false)
      await fetchRecipes()
    } catch (err) {
      console.error('Add recipe error:', err)
      setError(err.message)
    }
  }

  const handleDeleteRecipe = async (recipeId) => {
    try {
      // First delete all ingredients associated with the recipe
      const { error: ingredientsError } = await supabase
        .from('ingredients')
        .delete()
        .eq('recipe_id', recipeId)

      if (ingredientsError) throw ingredientsError

      // Then delete all tags associated with the recipe
      const { error: tagsError } = await supabase
        .from('tags')
        .delete()
        .eq('recipe_id', recipeId)

      if (tagsError) throw tagsError

      // Finally delete the recipe itself
      const { error: recipeError } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId)

      if (recipeError) throw recipeError

      // Refresh the recipes list
      await fetchRecipes()
      setRecipeToDelete(null)
    } catch (err) {
      console.error('Delete recipe error:', err)
      setError(err.message)
    }
  }

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('recipe_id')
        .eq('user_id', user.id)

      if (error) throw error
      setFavorites(data.map(fav => fav.recipe_id))
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const toggleFavorite = async (recipeId) => {
    try {
      const isFavorited = favorites.includes(recipeId)
      
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId)

        if (error) throw error
        setFavorites(favorites.filter(id => id !== recipeId))
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert([{
            user_id: user.id,
            recipe_id: recipeId
          }])

        if (error) throw error
        setFavorites([...favorites, recipeId])
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const renderRecipeCard = (recipe) => {
    const mealTypeColors = {
      Breakfast: 'bg-primary text-primary-content',
      Lunch: 'bg-secondary text-secondary-content',
      Dinner: 'bg-accent text-accent-content',
      Dessert: 'bg-neutral text-neutral-content'
    }

    const isFavorited = favorites.includes(recipe.id)

    return (
      <div key={recipe.id} className="card bg-base-100 shadow-xl">
        <figure className="relative h-48">
          <img 
            src={recipe.image_url} 
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button 
              className={`btn btn-circle btn-sm ${isFavorited ? 'btn-error' : 'btn-ghost'}`}
              onClick={() => toggleFavorite(recipe.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={isFavorited ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <div className={`badge ${mealTypeColors[recipe.type] || 'bg-base-300'}`}>
              {recipe.type}
            </div>
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
            <button 
              className="btn btn-error btn-sm"
              onClick={() => setRecipeToDelete(recipe.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
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
        <h2 className="text-2xl font-bold mb-4">Please log in to view recipes</h2>
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
        <div className="mt-2">
          <p>Auth State: {authState}</p>
          <p>User ID: {user?.id}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Delete Confirmation Modal */}
      {recipeToDelete && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Recipe</h3>
            <p className="py-4">Are you sure you want to delete this recipe? This action cannot be undone.</p>
            <div className="modal-action">
              <button 
                className="btn btn-ghost"
                onClick={() => setRecipeToDelete(null)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error"
                onClick={() => handleDeleteRecipe(recipeToDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Recipe Modal */}
      {showAddModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-2xl">Add New Recipe</h3>
              <button 
                className="btn btn-ghost btn-circle btn-lg text-xl hover:bg-base-200"
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
              >
                ×
              </button>
            </div>
            
            {/* Image Upload Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Recipe Image (Optional)</h3>
              <div className="flex flex-col items-center gap-4">
                {previewImage ? (
                  <div className="relative w-64 h-64">
                    <img 
                      src={previewImage} 
                      alt="Recipe preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      className="btn btn-circle btn-sm btn-error absolute -top-2 -right-2"
                      onClick={() => {
                        setPreviewImage(null)
                        setNewRecipe(prev => ({ ...prev, image_url: '' }))
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ''
                        }
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-base-200 transition-colors w-64 h-64 flex flex-col items-center justify-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-12 w-12 mx-auto mb-2 text-base-content/50" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                    <p className="text-base-content/70">
                      {uploadingImage ? 'Uploading...' : 'Click to upload recipe image (optional)'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Recipe Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter recipe name"
                  className="input input-bordered"
                  value={newRecipe.name}
                  onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Type</span>
                </label>
                <select
                  className="select select-bordered"
                  value={newRecipe.type}
                  onChange={(e) => setNewRecipe({ ...newRecipe, type: e.target.value })}
                >
                  {recipeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Difficulty</span>
                </label>
                <select
                  className="select select-bordered"
                  value={newRecipe.difficulty}
                  onChange={(e) => setNewRecipe({ ...newRecipe, difficulty: e.target.value })}
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Mode of Prep</span>
                </label>
                <select
                  className="select select-bordered"
                  value={newRecipe.modeOfPrep}
                  onChange={(e) => setNewRecipe({ ...newRecipe, modeOfPrep: e.target.value })}
                >
                  {modesOfPrep.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Prep Time</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15 mins"
                  className="input input-bordered"
                  value={newRecipe.prepTime}
                  onChange={(e) => setNewRecipe({ ...newRecipe, prepTime: e.target.value })}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Cook Time</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 30 mins"
                  className="input input-bordered"
                  value={newRecipe.cookTime}
                  onChange={(e) => setNewRecipe({ ...newRecipe, cookTime: e.target.value })}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Servings</span>
                </label>
                <input
                  type="number"
                  placeholder="Number of servings"
                  className="input input-bordered"
                  value={newRecipe.servings}
                  onChange={(e) => setNewRecipe({ ...newRecipe, servings: e.target.value })}
                />
              </div>
            </div>

            {/* Ingredients Table */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="bg-base-200">Ingredient</th>
                      <th className="bg-base-200">Amount</th>
                      <th className="bg-base-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newRecipe.ingredients.map((ingredient) => (
                      <tr key={ingredient.id}>
                        <td>{ingredient.name}</td>
                        <td>{ingredient.amount}</td>
                        <td>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleRemoveIngredient(ingredient.id)}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td>
                        <input
                          type="text"
                          placeholder="Add ingredient"
                          className="input input-bordered input-sm w-full"
                          value={newIngredient.name}
                          onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Amount"
                          className="input input-bordered input-sm w-full"
                          value={newIngredient.amount}
                          onChange={(e) => setNewIngredient({ ...newIngredient, amount: e.target.value })}
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={handleAddIngredient}
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Instructions</h3>
              <textarea
                className="textarea textarea-bordered w-full h-48"
                placeholder="Enter cooking instructions..."
                value={newRecipe.instructions}
                onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
              />
            </div>

            <div className="modal-action">
              <button 
                className="btn btn-ghost"
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddRecipe}
              >
                Add Recipe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Recipe Modal */}
      {showViewModal && selectedRecipe && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-2xl">{selectedRecipe.name}</h3>
              <div className="flex gap-2">
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => window.print()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Recipe
                </button>
                <button 
                  className="btn btn-ghost btn-circle btn-lg text-xl hover:bg-base-200"
                  onClick={() => setShowViewModal(false)}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Print-specific styling */}
            <style>
              {`
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  .print-content, .print-content * {
                    visibility: visible;
                  }
                  .print-content {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                  }
                  .no-print {
                    display: none;
                  }
                }
              `}
            </style>

            <div className="print-content">
              {/* Recipe Image */}
              <div className="mb-8">
                <img 
                  src={selectedRecipe.image_url} 
                  alt={selectedRecipe.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>

              {/* Recipe Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="stat bg-base-200 rounded-lg p-4">
                  <div className="stat-title">Prep Time</div>
                  <div className="stat-value text-lg">{selectedRecipe.prep_time}</div>
                </div>
                <div className="stat bg-base-200 rounded-lg p-4">
                  <div className="stat-title">Cook Time</div>
                  <div className="stat-value text-lg">{selectedRecipe.cook_time}</div>
                </div>
                <div className="stat bg-base-200 rounded-lg p-4">
                  <div className="stat-title">Servings</div>
                  <div className="stat-value text-lg">{selectedRecipe.servings}</div>
                </div>
                <div className="stat bg-base-200 rounded-lg p-4">
                  <div className="stat-title">Difficulty</div>
                  <div className="stat-value text-lg">{selectedRecipe.difficulty}</div>
                </div>
              </div>

              {/* Mode of Prep and Type */}
              <div className="mb-8 flex gap-4">
                <div className="badge badge-lg badge-primary p-4 text-lg">
                  {selectedRecipe.mode_of_prep}
                </div>
                <div className="badge badge-lg badge-secondary p-4 text-lg">
                  {selectedRecipe.type}
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Ingredients</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedRecipe.ingredients?.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
                      <span className="flex-1">{ingredient.name}</span>
                      <span className="font-semibold">{ingredient.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Instructions</h3>
                <div className="space-y-4">
                  {selectedRecipe.instructions.split('\n').map((step, index) => (
                    step.trim() && (
                      <div key={index} className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 bg-base-200 p-4 rounded-lg">
                          {step}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modal-action no-print">
              <button 
                className="btn btn-ghost"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
              {user?.id === selectedRecipe.user_id && (
                <button 
                  className="btn btn-error"
                  onClick={() => {
                    setShowViewModal(false)
                    setRecipeToDelete(selectedRecipe.id)
                  }}
                >
                  Delete Recipe
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Recipes</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            Add New Recipe
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="join w-full">
              <input
                type="text"
                placeholder="Search recipes, ingredients, or tags..."
                className="input input-bordered join-item w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="btn join-item"
                  onClick={() => setSearchQuery('')}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="w-full md:w-48">
            <select
              className="select select-bordered w-full"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-base-content/70 mb-4">
          Showing {filteredRecipes.length} of {recipes.length} recipes
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => renderRecipeCard(recipe))}
        </div>
      )}
    </div>
  )
}

export default Recipes 