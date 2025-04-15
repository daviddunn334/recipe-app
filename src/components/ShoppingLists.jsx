import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const ShoppingLists = () => {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("shopping_lists")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLists(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createList = async (e) => {
    e.preventDefault();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("shopping_lists")
        .insert([
          {
            name: newListName,
            user_id: user.id,
          },
        ])
        .select();

      if (error) throw error;

      setLists([data[0], ...lists]);
      setNewListName("");
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteList = async (listId) => {
    try {
      const { error } = await supabase
        .from("shopping_lists")
        .delete()
        .eq("id", listId);

      if (error) throw error;

      setLists(lists.filter((list) => list.id !== listId));
      if (selectedList === listId) {
        setSelectedList(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading shopping lists...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lists Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">Shopping Lists</h2>

            {/* Create List Form */}
            <form onSubmit={createList} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="New list name"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Create
                </button>
              </div>
            </form>

            {/* Lists */}
            <div className="space-y-2">
              {lists.map((list) => (
                <div
                  key={list.id}
                  className={`p-3 rounded-lg cursor-pointer ${
                    selectedList === list.id
                      ? "bg-indigo-50 border-indigo-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedList(list.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{list.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteList(list.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected List Items */}
        <div className="lg:col-span-2">
          {selectedList ? (
            <ShoppingListItems listId={selectedList} />
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Select a List
              </h2>
              <p className="text-gray-500">
                Choose a shopping list from the list to view and manage its
                items.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingLists;
