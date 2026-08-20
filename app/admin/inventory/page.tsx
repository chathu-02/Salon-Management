"use client";

import { useEffect, useState } from "react";
import { Plus, Package } from "lucide-react";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    item_name: '',
    category: '',
    current_stock: '',
    min_threshold: '',
  });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inventory');
      const result = await res.json();
      if (result.success) {
        setInventory(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch inventory", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        setIsAdding(false);
        setFormData({ item_name: '', category: '', current_stock: '', min_threshold: '' });
        fetchInventory();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    try {
      await fetch('/api/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, current_stock: newStock }),
      });
      fetchInventory();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Inventory</h1>
          <p className="text-muted-foreground mt-1">Track and manage salon products and supplies.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl flex items-center space-x-2 text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center space-x-2">
            <Package className="w-5 h-5 text-primary" />
            <span>New Inventory Item</span>
          </h3>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Item Name</label>
                <input
                  required
                  type="text"
                  className="w-full border border-border bg-background rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary"
                  value={formData.item_name}
                  onChange={e => setFormData({...formData, item_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                <input
                  type="text"
                  className="w-full border border-border bg-background rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Current Stock</label>
                <input
                  required
                  type="number"
                  className="w-full border border-border bg-background rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary"
                  value={formData.current_stock}
                  onChange={e => setFormData({...formData, current_stock: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Min Threshold</label>
                <input
                  required
                  type="number"
                  className="w-full border border-border bg-background rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary"
                  value={formData.min_threshold}
                  onChange={e => setFormData({...formData, min_threshold: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-sm font-medium border border-border rounded-xl text-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90"
              >
                Save Item
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {inventory.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              No inventory items found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Item Name</th>
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Stock</th>
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {inventory.map((item: any) => {
                    const isLowStock = item.current_stock <= item.min_threshold;
                    return (
                      <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-medium text-foreground">{item.item_name}</td>
                        <td className="p-4 text-muted-foreground">{item.category || '-'}</td>
                        <td className="p-4">
                          <div className="flex justify-center items-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${isLowStock ? 'bg-red-100 text-red-800 border-red-200' : 'bg-secondary text-secondary-foreground border-border'}`}>
                              {item.current_stock}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => updateStock(item.id, Math.max(0, item.current_stock - 1))}
                              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                            >
                              -
                            </button>
                            <button 
                              onClick={() => updateStock(item.id, item.current_stock + 1)}
                              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
