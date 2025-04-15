import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const ShoppingListItems = ({ listId }) => {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listName, setListName] = useState("");

  useEffect(() => {
    fetchListAndItems();
  }, [listId]);

  const fetchListAndItems = async () => {
    try {
      // Fetch list name
      const { data: listData, error: listError } = await supabase
        .from("shopping_lists")
        .select("name")
        .eq("id", listId)
        .single();

      if (listError) throw listError;
      setListName(listData.name);

      // Fetch items
      const { data: itemsData, error: itemsError } = await supabase
        .from("shopping_list_items")
        .select("*")
        .eq("list_id", listId)
        .order("created_at", { ascending: true });

      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("shopping_list_items")
        .insert([
          {
            list_id: listId,
            name: newItemName,
            quantity: newItemQuantity,
          },
        ])
        .select();

      if (error) throw error;

      setItems([...items, data[0]]);
      setNewItemName("");
      setNewItemQuantity("");
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleItem = async (itemId, currentStatus) => {
    try {
      const { error } = await supabase
        .from("shopping_list_items")
        .update({ is_completed: !currentStatus })
        .eq("id", itemId);

      if (error) throw error;

      setItems(
        items.map((item) =>
          item.id === itemId ? { ...item, is_completed: !currentStatus } : item
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const { error } = await supabase
        .from("shopping_list_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      setItems(items.filter((item) => item.id !== itemId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading items...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">{listName}</h2>

      {/* Add Item Form */}
      <form onSubmit={addItem} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Item name"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
          <input
            type="text"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(e.target.value)}
            placeholder="Quantity"
            className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
      </form>

      {/* Items List */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              item.is_completed ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={item.is_completed}
                onChange={() => toggleItem(item.id, item.is_completed)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span
                className={`${
                  item.is_completed ? "line-through text-gray-500" : ""
                }`}
              >
                {item.name}
                {item.quantity && (
                  <span className="text-gray-500 ml-2">({item.quantity})</span>
                )}
              </span>
            </div>
            <button
              onClick={() => deleteItem(item.id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No items in this list yet.</p>
        </div>
      )}
    </div>
  );
};

export default ShoppingListItems;
