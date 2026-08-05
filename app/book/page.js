"use client";

import { useState, useEffect } from 'react';

export default function BookingPage() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    service_id: '',
    appointment_time: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Page eka load weddi services tika gannawa
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const result = await res.json();
        if (result.success) {
          // is_active: true thiyena ewa witharak pennanawa
          setServices(result.data.filter(service => service.is_active));
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const payload = {
      customer_id: 'OYAGE_PROFILES_TABLE_EKE_THIYENA_UUID_EKAK_METHANATA_DANNA', 
      service_id: formData.service_id,
      staff_id: null, 
      appointment_time: formData.appointment_time,
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        setMessage('Appointment booked successfully! We will send you an SMS reminder 1 hour before.');
        setFormData({ service_id: '', appointment_time: '' }); // Form eka clear karanawa
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Book an Appointment</h2>
          <p className="mt-2 text-sm text-gray-600">Select your preferred service and time.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Dropdown */}
          <div>
            <label htmlFor="service_id" className="block text-sm font-medium text-gray-700">
              Select Service
            </label>
            <select
              id="service_id"
              name="service_id"
              required
              value={formData.service_id}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
            >
              <option value="" disabled>Select a service...</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - Rs. {service.price} ({service.duration_minutes} mins)
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time Picker */}
          <div>
            <label htmlFor="appointment_time" className="block text-sm font-medium text-gray-700">
              Date & Time
            </label>
            <input
              type="datetime-local"
              id="appointment_time"
              name="appointment_time"
              required
              value={formData.appointment_time}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm border"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>

        {/* Status Message */}
        {message && (
          <div className={`mt-4 p-4 rounded-md text-sm text-center ${message.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}