import { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaBoxOpen, FaSearch, FaFilter, FaEdit } from "react-icons/fa";
import supabase from "../supabase";

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    serialNumber: "",
    batchNumber: "",
    quantity: 1,
  });

  // Fetch inventory from the database
  useEffect(() => {
    fetchInventory();
  }, []);

  // Extract unique categories when inventory changes
  useEffect(() => {
    const uniqueCategories = [...new Set(inventory.map(item => item.category))];
    setCategories(uniqueCategories);
    applyFilters();
  }, [inventory, searchTerm, categoryFilter]);

  const fetchInventory = async () => {
    const { data, error } = await supabase.from("inventory").select("*");
    if (error) console.error("Error fetching inventory:", error);
    else setInventory(data || []);
  };

  const applyFilters = () => {
    let filtered = [...inventory];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.serial_number && item.serial_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.batch_number && item.batch_number.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    setFilteredInventory(filtered);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingItem(prev => ({ ...prev, [name]: value }));
    } else {
      setNewItem(prev => ({ ...prev, [name]: value }));
    }
  };

  // Add new inventory item
  const addItem = async () => {
    if (!newItem.name || !newItem.category) return;
  
    const { data, error } = await supabase
      .from("inventory")
      .insert([
        {
          name: newItem.name,
          category: newItem.category,
          serial_number: newItem.serialNumber || null,
          batch_number: newItem.batchNumber || null,
          quantity: newItem.quantity,
        },
      ])
      .select();
  
    if (error) {
      console.error("Error adding item:", error);
      return;
    }
  
    setInventory(prev => [...prev, ...(data || [])]);
    setNewItem({ name: "", category: "", serialNumber: "", batchNumber: "", quantity: 1 });
  };

  // Start editing an item
  const startEditing = (item) => {
    setIsEditing(true);
    setEditingItem({
      ...item,
      serialNumber: item.serial_number,
      batchNumber: item.batch_number
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditingItem(null);
  };

  // Update existing item
  const updateItem = async () => {
    if (!editingItem.name || !editingItem.category) return;

    const { error } = await supabase
      .from("inventory")
      .update({
        name: editingItem.name,
        category: editingItem.category,
        serial_number: editingItem.serialNumber || null,
        batch_number: editingItem.batchNumber || null,
        quantity: editingItem.quantity
      })
      .eq("id", editingItem.id);

    if (error) {
      console.error("Error updating item:", error);
      return;
    }

    setInventory(prev => 
      prev.map(item => item.id === editingItem.id ? {
        ...item,
        name: editingItem.name,
        category: editingItem.category,
        serial_number: editingItem.serialNumber,
        batch_number: editingItem.batchNumber,
        quantity: editingItem.quantity
      } : item)
    );

    setIsEditing(false);
    setEditingItem(null);
  };

  // Remove item from inventory
  const removeItem = async (id) => {
    const { error } = await supabase.from("inventory").delete().eq("id", id);
    if (error) {
      console.error("Error deleting item:", error);
    } else {
      setInventory(inventory.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-primary text-primary-content p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="mt-2">Manage your project equipment and materials efficiently</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card 1: Add New Item */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-6">
            <div className="flex items-center mb-4">
              <FaBoxOpen className="text-primary text-xl mr-2" />
              <h2 className="text-xl font-semibold">{isEditing ? "Edit Item" : "Add New Item"}</h2>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                value={isEditing ? editingItem.name : newItem.name}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={isEditing ? editingItem.category : newItem.category}
                onChange={handleChange}
                className="input input-bordered w-full"
                list="categories"
              />
              <datalist id="categories">
                {categories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              <input
                type="text"
                name="serialNumber"
                placeholder="Serial Number (Optional)"
                value={isEditing ? editingItem.serialNumber : newItem.serialNumber}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                name="batchNumber"
                placeholder="Batch Number (Optional)"
                value={isEditing ? editingItem.batchNumber : newItem.batchNumber}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={isEditing ? editingItem.quantity : newItem.quantity}
                onChange={handleChange}
                className="input input-bordered w-full"
                min="1"
              />
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button onClick={updateItem} className="btn btn-primary flex-1">
                      <FaEdit className="mr-2" /> Update Item
                    </button>
                    <button onClick={cancelEditing} className="btn btn-outline">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={addItem} className="btn btn-success w-full">
                    <FaPlus className="mr-2" /> Add Item
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Search and Filter */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-6">
            <div className="flex items-center mb-4">
              <FaSearch className="text-primary text-xl mr-2" />
              <h2 className="text-xl font-semibold">Search & Filter</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Search Items</label>
                <input
                  type="text"
                  placeholder="Search by name, serial or batch #"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Filter by Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="bg-base-200 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Inventory Summary</h3>
                <p><span className="font-semibold">Total Items:</span> {inventory.length}</p>
                <p><span className="font-semibold">Categories:</span> {categories.length}</p>
                <p><span className="font-semibold">Filtered Items:</span> {filteredInventory.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Quick Stats */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-6">
            <div className="flex items-center mb-4">
              <FaFilter className="text-primary text-xl mr-2" />
              <h2 className="text-xl font-semibold">Inventory Breakdown</h2>
            </div>
            <div className="space-y-4">
              {categories.slice(0, 5).map(category => {
                const categoryItems = inventory.filter(item => item.category === category);
                const totalQuantity = categoryItems.reduce((sum, item) => sum + item.quantity, 0);
                
                return (
                  <div key={category} className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                    <div>
                      <div className="font-medium">{category}</div>
                      <div className="text-sm text-base-content opacity-70">{categoryItems.length} unique items</div>
                    </div>
                    <div className="text-lg font-bold">{totalQuantity}</div>
                  </div>
                );
              })}
              {categories.length > 5 && (
                <p className="text-sm text-base-content opacity-60 text-center">
                  +{categories.length - 5} more categories
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory List */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-6">
          <h2 className="text-xl font-semibold mb-4">Inventory List</h2>
          {filteredInventory.length === 0 ? (
            <p className="text-base-content opacity-60 italic text-center py-8">
              {inventory.length === 0 ? "No items in inventory." : "No items match your search criteria."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Serial #</th>
                    <th>Batch #</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>
                        <span className="badge badge-primary badge-outline">
                          {item.category}
                        </span>
                      </td>
                      <td>{item.serial_number || "N/A"}</td>
                      <td>{item.batch_number || "N/A"}</td>
                      <td>{item.quantity}</td>
                      <td className="flex gap-2">
                        <button 
                          onClick={() => startEditing(item)} 
                          className="btn btn-sm btn-primary"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="btn btn-sm btn-error"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;