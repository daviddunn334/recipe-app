import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Calendar, ChevronLeft, ChevronRight, Printer, Plus, X } from 'lucide-react'

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
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('week_start', currentWeekStart)
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      
      if (data) {
        setMealPlan(data.meals)
      } else {
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
      }
    } catch (error) {
      console.error('Error fetching meal plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveMealPlan = async () => {
    try {
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
    } catch (error) {
      console.error('Error saving meal plan:', error)
    }
  }

  const handleMealClick = (day, mealType) => {
    setSelectedDay(day)
    setSelectedMeal(mealType)
    
    const filtered = recipes.filter(recipe => {
      const tags = recipe.tags || []
      return tags.some(tag => 
        tag.name.toLowerCase() === mealType.toLowerCase() || 
        tag.name.toLowerCase().includes(mealType.toLowerCase())
      )
    })
    
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
        className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative group border border-base-200 hover:border-${color}/20`}
        onClick={() => handleMealClick(day, mealType)}
      >
        <div className="card-body p-4">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="btn btn-circle btn-sm btn-error shadow-md"
              onClick={(e) => {
                e.stopPropagation()
                handleClearMeal(day, mealType)
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {meal ? (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-base-content">{meal.name}</h3>
              <div className="flex flex-wrap gap-2">
                {meal.tags?.map(tag => (
                  <span key={tag.id} className={`badge badge-${color} shadow-sm`}>{tag.name}</span>
                ))}
              </div>
              <div className="flex justify-between text-sm text-base-content/70 bg-base-200/50 p-2 rounded-lg">
                <span>Prep: {meal.prep_time}m</span>
                <span>Cook: {meal.cook_time}m</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-24 text-base-content/50 bg-base-200/30 rounded-lg">
              <Plus className="w-8 h-8 mb-2" />
              <p>Add {mealType}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Weekly Meal Plan</h1>
          <div className="join">
            <button 
              className="join-item btn btn-ghost"
              onClick={() => handleWeekChange('prev')}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="join-item btn btn-ghost">
              <Calendar className="w-5 h-5 mr-2" />
              {new Date(currentWeekStart).toLocaleDateString()} - {new Date(new Date(currentWeekStart).setDate(new Date(currentWeekStart).getDate() + 6)).toLocaleDateString()}
            </button>
            <button 
              className="join-item btn btn-ghost"
              onClick={() => handleWeekChange('next')}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handlePrint}
        >
          <Printer className="w-5 h-5 mr-2" />
          Print Meal Plan
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        {Object.keys(mealPlan).map(day => (
          <div key={day} className="space-y-4">
            <div className="bg-primary text-primary-content p-3 rounded-lg text-center">
              <h2 className="text-xl font-semibold capitalize">
                {day}
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-primary mb-2">Breakfast</h3>
                {renderMealSlot(day, 'breakfast')}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-secondary mb-2">Lunch</h3>
                {renderMealSlot(day, 'lunch')}
              </div>
              <div>
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
          <div className="modal-box max-w-3xl bg-base-100">
            <h3 className="font-bold text-lg mb-4">
              Select a {selectedMeal} recipe
            </h3>
            
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : filteredRecipes.length === 0 ? (
              <div className="text-center p-4">
                <p className="text-base-content/70 mb-4">No {selectedMeal} recipes found.</p>
                <p className="text-sm text-base-content/50">
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
                className="btn btn-ghost"
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