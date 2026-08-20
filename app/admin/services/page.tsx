"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Sparkles } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: '',
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services');
      const result = await res.json();
      if (result.success) {
        setServices(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch services", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        setIsAdding(false);
        setFormData({ name: '', description: '', price: '', duration_minutes: '' });
        fetchServices();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Services</h1>
          <p className="text-muted-foreground mt-1">Manage the services offered at the salon.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl flex items-center space-x-2 text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>New Service</span>
          </h3>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                <input
                  required
                  type="text"
                  className="w-full border border-border bg-background rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Price (Rs.)</label>
                <input
                  required
                  type="number"
                  className="w-full border border-border bg-background rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  className="w-full border border-border bg-background rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary"
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Duration (Mins)</label>
                <input
                  required
                  type="number"
                  className="w-full border border-border bg-background rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary"
                  value={formData.duration_minutes}
                  onChange={e => setFormData({...formData, duration_minutes: e.target.value})}
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
                Save Service
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any) => (
            <div key={service.id} className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg text-foreground">{service.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${service.is_active ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                  {service.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-6 h-10 overflow-hidden">
                {service.description || 'No description provided.'}
              </p>
              
              <div className="flex justify-between items-center border-t border-border pt-4">
                <div>
                  <span className="block text-xs text-muted-foreground uppercase tracking-wider">Price</span>
                  <span className="font-bold text-foreground">Rs. {service.price}</span>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-muted-foreground uppercase tracking-wider">Duration</span>
                  <span className="font-medium text-foreground">{service.duration_minutes}m</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
