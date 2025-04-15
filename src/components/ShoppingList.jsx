import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function ShoppingList() {
  const [shoppingLists, setShoppingLists] = useState([])
  const [currentList, setCurrentList] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [newListName, setNewListName] = useState('')
  const [showNewListModal, setShowNewListModal] = useState(false)

  useEffect(() => {
    fetchShoppingLists()
  }, [])

  useEffect(() => {
    if (currentList) {
      fetchListItems()
    }
  }, [currentList])

  const fetchShoppingLists = async () => {
    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setShoppingLists(data)
      if (data.length > 0 && !currentList) {
        setCurrentList(data[0])
      }
    } catch (error) {
      console.error('Error fetching shopping lists:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchListItems = async () => {
    try {
      const { data, error } = await supabase
        .from('shopping_list_items')
        .select(`
          *,
          ingredients (
            name,
            category
          )
        `)
        .eq('shopping_list_id', currentList.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setItems(data)
    } catch (error) {
      console.error('Error fetching list items:', error)
    }
  }

  const createNewList = async () => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('shopping_lists')
        .insert([{ 
          name: newListName,
          user_id: user.id 
        }])
        .select()
        .single()

      if (error) throw error
      setShoppingLists([data, ...shoppingLists])
      setCurrentList(data)
      setNewListName('')
      setShowNewListModal(false)
    } catch (error) {
      console.error('Error creating shopping list:', error)
    }
  }

  const toggleItemChecked = async (itemId, checked) => {
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .update({ checked: !checked })
        .eq('id', itemId)

      if (error) throw error
      fetchListItems()
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const deleteItem = async (itemId) => {
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
      fetchListItems()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const deleteList = async (listId) => {
    try {
      const { error } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', listId)

      if (error) throw error
      setShoppingLists(shoppingLists.filter(list => list.id !== listId))
      if (currentList?.id === listId) {
        setCurrentList(shoppingLists[0] || null)
      }
    } catch (error) {
      console.error('Error deleting shopping list:', error)
    }
  }

  const generateFromMealPlan = async () => {
    try {
      // Get the current week's meal plan
      const { data: mealPlan, error: mealPlanError } = await supabase
        .from('meal_plans')
        .select('meals')
        .eq('week_start', new Date().toISOString().split('T')[0])
        .single()

      if (mealPlanError) throw mealPlanError

      // Extract all recipe IDs from the meal plan
      const recipeIds = Object.values(mealPlan.meals)
        .flatMap(day => Object.values(day))
        .filter(meal => meal !== null)
        .map(meal => meal.id)

      // Get all ingredients for these recipes
      const { data: ingredients, error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .select(`
          ingredient_id,
          quantity,
          unit,
          ingredients (
            name,
            category
          )
        `)
        .in('recipe_id', recipeIds)

      if (ingredientsError) throw ingredientsError

      // Create a new shopping list
      const { data: newList, error: listError } = await supabase
        .from('shopping_lists')
        .insert([{ name: 'Meal Plan Shopping List' }])
        .select()
        .single()

      if (listError) throw listError

      // Add ingredients to the shopping list
      const itemsToInsert = ingredients.map(item => ({
        shopping_list_id: newList.id,
        ingredient_id: item.ingredient_id,
        quantity: item.quantity,
        unit: item.unit
      }))

      const { error: itemsError } = await supabase
        .from('shopping_list_items')
        .insert(itemsToInsert)

      if (itemsError) throw itemsError

      setShoppingLists([newList, ...shoppingLists])
      setCurrentList(newList)
      fetchListItems()
    } catch (error) {
      console.error('Error generating shopping list:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Shopping Lists</h1>
        <div className="flex gap-4">
          <button 
            className="btn btn-primary"
            onClick={() => setShowNewListModal(true)}
          >
            New List
          </button>
          <button 
            className="btn btn-secondary"
            onClick={generateFromMealPlan}
          >
            Generate from Meal Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Shopping Lists Sidebar */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Lists</h2>
          <div className="space-y-2">
            {shoppingLists.map(list => (
              <div 
                key={list.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  currentList?.id === list.id 
                    ? 'bg-primary text-primary-content' 
                    : 'bg-base-200 hover:bg-base-300'
                }`}
                onClick={() => setCurrentList(list)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{list.name}</span>
                  <button 
                    className="btn btn-circle btn-sm btn-error"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteList(list.id)
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shopping List Items */}
        <div className="md:col-span-3">
          {currentList ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{currentList.name}</h2>
              <div className="space-y-2">
                {items.map(item => (
                  <div 
                    key={item.id}
                    className={`p-4 rounded-lg bg-base-200 flex items-center justify-between ${
                      item.checked ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input 
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={item.checked}
                        onChange={() => toggleItemChecked(item.id, item.checked)}
                      />
                      <div>
                        <span className="font-medium">{item.ingredients.name}</span>
                        <span className="text-sm text-base-content/70 ml-2">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="btn btn-circle btn-sm btn-error"
                      onClick={() => deleteItem(item.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-base-200 rounded-lg">
              <p className="text-lg">Select a shopping list or create a new one</p>
            </div>
          )}
        </div>
      </div>

      {/* New List Modal */}
      {showNewListModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New Shopping List</h3>
            <input
              type="text"
              placeholder="List Name"
              className="input input-bordered w-full mb-4"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <div className="modal-action">
              <button 
                className="btn"
                onClick={() => setShowNewListModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={createNewList}
                disabled={!newListName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShoppingList 