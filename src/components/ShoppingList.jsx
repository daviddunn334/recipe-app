import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Plus, Trash2, Check, X, ShoppingCart } from 'lucide-react'

function ShoppingList() {
  const [lists, setLists] = useState([])
  const [currentList, setCurrentList] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showNewListModal, setShowNewListModal] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newItemName, setNewItemName] = useState('')

  useEffect(() => {
    fetchLists()
  }, [])

  useEffect(() => {
    if (currentList) {
      fetchListItems()
    }
  }, [currentList])

  const fetchLists = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setLists(data || [])
      if (data?.length > 0 && !currentList) {
        setCurrentList(data[0])
      }
    } catch (err) {
      setError(err.message)
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
      setItems(data || [])
    } catch (err) {
      setError(err.message)
    }
  }

  const createList = async (e) => {
    e.preventDefault()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('shopping_lists')
        .insert([{
          name: newListName,
          user_id: user.id
        }])
        .select()
        .single()

      if (error) throw error
      setLists([data, ...lists])
      setCurrentList(data)
      setNewListName('')
      setShowNewListModal(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteList = async (listId) => {
    try {
      const { error } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', listId)

      if (error) throw error
      setLists(lists.filter(list => list.id !== listId))
      if (currentList?.id === listId) {
        setCurrentList(lists[0] || null)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const addItem = async (e) => {
    e.preventDefault()
    try {
      if (!currentList || !newItemName.trim()) return

      const { data, error } = await supabase
        .from('shopping_list_items')
        .insert([{
          shopping_list_id: currentList.id,
          name: newItemName.trim(),
          checked: false
        }])
        .select()
        .single()

      if (error) throw error
      setItems([...items, data])
      setNewItemName('')
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleItemChecked = async (itemId, checked) => {
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .update({ checked: !checked })
        .eq('id', itemId)

      if (error) throw error
      setItems(items.map(item => 
        item.id === itemId ? { ...item, checked: !checked } : item
      ))
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteItem = async (itemId) => {
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
      setItems(items.filter(item => item.id !== itemId))
    } catch (err) {
      setError(err.message)
    }
  }

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

      {/* List Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {lists.map(list => (
          <div
            key={list.id}
            className={`card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow ${
              currentList?.id === list.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setCurrentList(list)}
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
              <div className="flex items-center text-sm text-base-content/70">
                <ShoppingCart className="w-4 h-4 mr-2" />
                {items.length || 0} items
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current List Items */}
      {currentList && (
        <div className="bg-base-100 rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{currentList.name}</h2>
          </div>

          {/* Add Item Form */}
          <form onSubmit={addItem} className="mb-6">
            <div className="join w-full">
              <input
                type="text"
                placeholder="Add new item..."
                className="input input-bordered join-item w-full"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
              <button type="submit" className="btn btn-primary join-item">
                Add
              </button>
            </div>
          </form>

          {/* Items List */}
          <div className="space-y-2">
            {items.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItemChecked(item.id, item.checked)}
                  className="checkbox checkbox-primary"
                />
                <span className={`flex-1 ${item.checked ? 'line-through text-base-content/50' : ''}`}>
                  {item.name}
                </span>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="btn btn-ghost btn-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-8">
              <p className="text-base-content/50">No items in this list yet.</p>
            </div>
          )}
        </div>
      )}

      {/* New List Modal */}
      {showNewListModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New List</h3>
            <form onSubmit={createList}>
              <div className="form-control">
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
              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setShowNewListModal(false)}
                  className="btn btn-ghost"
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
    </div>
  )
}

export default ShoppingList 