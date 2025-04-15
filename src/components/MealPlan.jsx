import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function MealPlan() {
  const [mealPlan, setMealPlan] = useState({
    monday: { breakfast: null, lunch: null, dinner: null },
    tuesday: { breakfast: null, lunch: null, dinner: null },
    wednesday: { breakfast: null, lunch: null, dinner: null },
    thursday: { breakfast: null, lunch: null, dinner: null },
    friday: { breakfast: null, lunch: null, dinner: null },
    saturday: { breakfast: null, lunch: null, dinner: null },
    sunday: { breakfast: null, lunch: null, dinner: null }
  })
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showRecipeModal, setShowRecipeModal] = useState(false)
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedMeal, setSelectedMeal] = useState('')
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1)
    return monday.toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchRecipes()
    fetchMealPlan()
  }, [currentWeekStart])

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          tags (
            name
          )
        `)
      
      if (error) throw error
      console.log('Fetched recipes:', data)
      setRecipes(data)
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMealPlan = async () => {
    try {
      setLoading(true)
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error('No authenticated user')

      // Try to fetch the meal plan for the current week and user
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('week_start', currentWeekStart)
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 is "no rows returned"
      
      if (data) {
        console.log('Loaded meal plan:', data)
        setMealPlan(data.meals)
      } else {
        // If no meal plan exists for this week, create a new one
        const { error: insertError } = await supabase
          .from('meal_plans')
          .insert([{
            week_start: currentWeekStart,
            meals: mealPlan,
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])

        if (insertError) throw insertError
        console.log('Created new meal plan for week:', currentWeekStart)
      }
    } catch (error) {
      console.error('Error fetching meal plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveMealPlan = async () => {
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error('No authenticated user')

      const { error } = await supabase
        .from('meal_plans')
        .upsert({
          week_start: currentWeekStart,
          meals: mealPlan,
          updated_at: new Date().toISOString(),
          user_id: user.id
        })

      if (error) throw error
      console.log('Meal plan saved successfully')
    } catch (error) {
      console.error('Error saving meal plan:', error)
    }
  }

  const handleMealClick = (day, mealType) => {
    setSelectedDay(day)
    setSelectedMeal(mealType)
    
    console.log('All recipes:', recipes)
    console.log('Filtering for meal type:', mealType.toLowerCase())
    
    const filtered = recipes.filter(recipe => {
      const tags = recipe.tags || []
      console.log('Recipe:', recipe.name, 'Tags:', tags.map(t => t.name))
      return tags.some(tag => 
        tag.name.toLowerCase() === mealType.toLowerCase() || 
        tag.name.toLowerCase().includes(mealType.toLowerCase())
      )
    })
    
    console.log('Filtered recipes:', filtered)
    setFilteredRecipes(filtered)
    setShowRecipeModal(true)
  }

  const handleRecipeSelect = async (recipe) => {
    const newMealPlan = {
      ...mealPlan,
      [selectedDay]: {
        ...mealPlan[selectedDay],
        [selectedMeal]: recipe
      }
    }
    setMealPlan(newMealPlan)
    setShowRecipeModal(false)
    await saveMealPlan()
  }

  const handleClearMeal = async (day, mealType) => {
    const newMealPlan = {
      ...mealPlan,
      [day]: {
        ...mealPlan[day],
        [mealType]: null
      }
    }
    setMealPlan(newMealPlan)
    await saveMealPlan()
  }

  const handleWeekChange = (direction) => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    const newWeekStart = newDate.toISOString().split('T')[0]
    setCurrentWeekStart(newWeekStart)
    // The useEffect will trigger fetchMealPlan with the new week
  }

  const handlePrint = () => {
    window.print()
  }

  const renderMealSlot = (day, mealType) => {
    const meal = mealPlan[day][mealType]
    const mealColors = {
      breakfast: 'primary',
      lunch: 'secondary',
      dinner: 'accent'
    }
    const color = mealColors[mealType]
    
    return (
      <div 
        className={`p-4 border-2 border-${color} rounded-lg cursor-pointer hover:bg-${color}/10 transition-colors relative group`}
        onClick={() => handleMealClick(day, mealType)}
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="btn btn-circle btn-sm btn-error"
            onClick={(e) => {
              e.stopPropagation()
              handleClearMeal(day, mealType)
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {meal ? (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{meal.name}</h3>
            <div className="flex flex-wrap gap-2">
              {meal.tags?.map(tag => (
                <span key={tag.id} className={`badge badge-${color}`}>{tag.name}</span>
              ))}
            </div>
            <div className="flex justify-between text-sm text-base-content/70">
              <span>Prep: {meal.prep_time}m</span>
              <span>Cook: {meal.cook_time}m</span>
            </div>
          </div>
        ) : (
          <div className="text-center text-base-content/50">
            <span className="text-2xl mb-2 block">+</span>
            <p>Add {mealType}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Weekly Meal Plan</h1>
        <div className="flex gap-4">
          <div className="join">
            <button 
              className="join-item btn btn-primary"
              onClick={() => handleWeekChange('prev')}
            >
              Previous Week
            </button>
            <button className="join-item btn btn-primary">
              {new Date(currentWeekStart).toLocaleDateString()} - {new Date(new Date(currentWeekStart).setDate(new Date(currentWeekStart).getDate() + 6)).toLocaleDateString()}
            </button>
            <button 
              className="join-item btn btn-primary"
              onClick={() => handleWeekChange('next')}
            >
              Next Week
            </button>
          </div>
          <button 
            className="btn btn-secondary"
            onClick={handlePrint}
          >
            Print Meal Plan
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        {Object.keys(mealPlan).map(day => (
          <div key={day} className="space-y-4">
            <h2 className="text-xl font-semibold capitalize text-center p-2 bg-primary text-primary-content rounded-lg">
              {day}
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-2">
                <h3 className="text-sm font-semibold text-primary mb-2">Breakfast</h3>
                {renderMealSlot(day, 'breakfast')}
              </div>
              <div className="border-l-4 border-secondary pl-2">
                <h3 className="text-sm font-semibold text-secondary mb-2">Lunch</h3>
                {renderMealSlot(day, 'lunch')}
              </div>
              <div className="border-l-4 border-accent pl-2">
                <h3 className="text-sm font-semibold text-accent mb-2">Dinner</h3>
                {renderMealSlot(day, 'dinner')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Selection Modal */}
      {showRecipeModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg mb-4">
              Select a {selectedMeal} recipe
            </h3>
            
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : filteredRecipes.length === 0 ? (
              <div className="text-center p-4">
                <p className="text-gray-500 mb-4">No {selectedMeal} recipes found.</p>
                <p className="text-sm text-gray-400">
                  Make sure your recipes have the "{selectedMeal}" tag.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                {filteredRecipes.map(recipe => (
                  <div 
                    key={recipe.id}
                    className="card bg-base-200 cursor-pointer hover:bg-base-300 transition-colors"
                    onClick={() => handleRecipeSelect(recipe)}
                  >
                    <div className="card-body">
                      {recipe.image_url && (
                        <img 
                          src={recipe.image_url} 
                          alt={recipe.name}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                      )}
                      <h3 className="card-title">{recipe.name}</h3>
                      <p className="text-sm text-base-content/70">
                        Prep: {recipe.prep_time}m • Cook: {recipe.cook_time}m
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {recipe.tags?.map(tag => (
                          <span key={tag.id} className="badge badge-primary">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="modal-action">
              <button 
                className="btn"
                onClick={() => setShowRecipeModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MealPlan 