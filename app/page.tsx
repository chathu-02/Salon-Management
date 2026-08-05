import { isSupabaseConfigured, supabase } from '../lib/supabase';

// Next.js wala default Server Component ekak nisa direct async function ekak use karanna puluwan
export default async function Home() {
  if (!isSupabaseConfigured || !supabase) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-amber-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Premium Salon & Spa</h1>
          <p className="text-gray-600">
            Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.
          </p>
        </div>
      </main>
    );
  }
  
  // Supabase 'services' table eken data fetch kirima
  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true); // Active thiyena services witharak gannawa

  if (error) {
    console.error('Error fetching services:', error.message);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Premium Salon & Spa</h1>
          <p className="text-gray-500">Book your perfect style with us</p>
        </header>

        {/* Services Grid Eka */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {!services || services.length === 0 ? (
            <div className="col-span-full text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500">No services available right now.</p>
            </div>
          ) : (
            services.map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
                  <p className="text-gray-500 text-sm mt-1 h-10 overflow-hidden">
                    {service.description || 'Experience our premium service crafted just for you.'}
                  </p>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-2">
                  <span className="text-xl font-bold text-slate-800">Rs. {service.price}</span>
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {service.duration_minutes} Mins
                  </span>
                </div>
                
                <button className="w-full mt-5 bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Book Appointment
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}