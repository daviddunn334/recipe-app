import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Plus, Pencil, Trash2, Edit2, Check, X, ShoppingCart, ListPlus } from 'lucide-react'

function ShoppingList() {
  const [shoppingLists, setShoppingLists] = useState([])
  const [currentList, setCurrentList] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [newListName, setNewListName] = useState('')
  const [showNewListModal, setShowNewListModal] = useState(false)
  const [showItemModal, setShowItemModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    notes: '',
    is_checked: false
  })

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
        .select('*')
        .eq('shopping_list_id', currentList.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setItems(data)
    } catch (error) {
      console.error('Error fetching list items:', error)
    }
  }

  const createNewList = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
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

  const handleAddItem = async () => {
    try {
      if (!currentList) return

      const { data, error } = await supabase
        .from('shopping_list_items')
        .insert([{
          shopping_list_id: currentList.id,
          name: newItem.name,
          price: newItem.price ? parseFloat(newItem.price) : null,
          notes: newItem.notes,
          is_checked: newItem.is_checked
        }])
        .select()
        .single()

      if (error) throw error
      setItems([...items, data])
      setNewItem({ name: '', price: '', notes: '', is_checked: false })
      setShowItemModal(false)
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const handleUpdateItem = async () => {
    try {
      if (!editingItem) return

      const { error } = await supabase
        .from('shopping_list_items')
        .update({
          name: newItem.name,
          price: newItem.price ? parseFloat(newItem.price) : null,
          notes: newItem.notes,
          is_checked: newItem.is_checked
        })
        .eq('id', editingItem.id)

      if (error) throw error
      fetchListItems()
      setEditingItem(null)
      setNewItem({ name: '', price: '', notes: '', is_checked: false })
      setShowItemModal(false)
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setNewItem({
      name: item.name,
      price: item.price || '',
      notes: item.notes || '',
      is_checked: item.is_checked
    })
    setShowItemModal(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shopping Lists</h1>
        <button
          onClick={() => setShowNewListModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          New List
        </button>
      </div>

      {/* List of Shopping Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {shoppingLists.map(list => (
          <div
            key={list.id}
            className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
            onClick={() => {
              setCurrentList(list)
              fetchListItems()
            }}
          >
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title">{list.name}</h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteList(list.id)
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <ShoppingCart className="w-4 h-4 mr-2" />
                {items.length || 0} items
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected List Modal */}
      {currentList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-base-100 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{currentList.name}</h2>
              <button
                onClick={() => setCurrentList(null)}
                className="btn btn-ghost"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <button
                onClick={() => {
                  setEditingItem(null)
                  setNewItem({ name: '', price: '', notes: '', is_checked: false })
                  setShowItemModal(true)
                }}
                className="btn btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-base-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={item.is_checked}
                      onChange={() => toggleItemChecked(item.id, item.is_checked)}
                      className="checkbox checkbox-primary"
                    />
                    <div>
                      <h3 className={`font-medium ${item.is_checked ? 'line-through text-gray-500' : ''}`}>
                        {item.name}
                      </h3>
                      {item.price && (
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                      )}
                      {item.notes && (
                        <p className="text-sm text-gray-500">{item.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditModal(item)
                      }}
                      className="btn btn-ghost btn-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteItem(item.id)
                      }}
                      className="btn btn-ghost btn-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New List Modal */}
      {showNewListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-base-100 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New List</h2>
            <form onSubmit={createNewList}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">List Name</span>
                </label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="input input-bordered"
                  required
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewListModal(false)}
                  className="btn"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-base-100 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingItem ? 'Edit Item' : 'Add Item'}
            </h2>
            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Item Name</span>
                </label>
                <input
                  type="text"
                  value={editingItem ? editingItem.name : newItem.name}
                  onChange={(e) => {
                    if (editingItem) {
                      setEditingItem({ ...editingItem, name: e.target.value })
                    } else {
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                  }}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Price (optional)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingItem ? editingItem.price : newItem.price}
                  onChange={(e) => {
                    if (editingItem) {
                      setEditingItem({ ...editingItem, price: e.target.value })
                    } else {
                      setNewItem({ ...newItem, price: e.target.value })
                    }
                  }}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Notes (optional)</span>
                </label>
                <textarea
                  value={editingItem ? editingItem.notes : newItem.notes}
                  onChange={(e) => {
                    if (editingItem) {
                      setEditingItem({ ...editingItem, notes: e.target.value })
                    } else {
                      setNewItem({ ...newItem, notes: e.target.value })
                    }
                  }}
                  className="textarea textarea-bordered"
                  rows="3"
                />
              </div>
              <div className="form-control mb-4">
                <label className="label cursor-pointer">
                  <span className="label-text">Purchased</span>
                  <input
                    type="checkbox"
                    checked={editingItem ? editingItem.is_checked : newItem.is_checked}
                    onChange={(e) => {
                      if (editingItem) {
                        setEditingItem({ ...editingItem, is_checked: e.target.checked })
                      } else {
                        setNewItem({ ...newItem, is_checked: e.target.checked })
                      }
                    }}
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowItemModal(false)
                    setEditingItem(null)
                  }}
                  className="btn"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShoppingList 