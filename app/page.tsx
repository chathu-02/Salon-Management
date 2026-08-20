import Link from 'next/link';
import { ArrowRight, Sparkles, Clock, MapPin, Scissors, Star } from 'lucide-react';
import { db } from '@/lib/db';
import OurWorkCarousel from '@/components/OurWorkCarousel';
import ReviewsCarousel from '@/components/ReviewsCarousel';

export default function Home() {
  const services = db.getServices(true);
  const reviews = db.getReviews();

  return (
    <div className="flex flex-col min-h-screen bg-[#032B1E] text-[#F5F5F0]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#021a12] text-[#F5F5F0] pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#021a12] via-[#021a12]/90 to-black/90 z-0"></div>
        
        {/* Decorative lighting */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#B38B4D]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-[#B38B4D]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 font-serif">
            Elevate Your <span className="text-[#B38B4D] italic">Elegance</span>
          </h1>
          
          <p className="mt-4 text-base sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            Discover a sanctuary of beauty and relaxation. Our expert stylists deliver personalized experiences tailored just for you.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/book"
              className="bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] font-bold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-[0_0_25px_rgba(179,139,77,0.35)] flex items-center justify-center space-x-2"
            >
              <span>Book an Appointment</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link 
              href="/about"
              className="bg-black/50 hover:bg-black/70 text-[#F5F5F0] border border-[#B38B4D]/40 font-semibold px-8 py-4 rounded-full transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Our Story</span>
            </Link>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-[#B38B4D]" />
              Open Daily: 9 AM - 8 PM
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-[#B38B4D]" />
              123 Premium Avenue, Colombo
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-24 bg-[#021a12] border-y border-[#B38B4D]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-[#B38B4D]/10 rounded-3xl blur-lg"></div>
              <img 
                src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=800&auto=format&fit=crop" 
                alt="Salon Experience" 
                className="relative rounded-2xl shadow-2xl object-cover h-[480px] w-full border border-[#B38B4D]/30"
              />
              <div className="absolute -bottom-6 -right-6 bg-[#032B1E] p-6 rounded-2xl border border-[#B38B4D]/40 shadow-2xl">
                <p className="text-3xl font-bold text-[#F5F5F0] font-serif">10+</p>
                <p className="text-xs text-[#B38B4D] font-semibold uppercase tracking-wider">Years of Excellence</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/5 border border-[#B38B4D]/30 rounded-full px-3.5 py-1">
                <Scissors className="w-3.5 h-3.5 text-[#B38B4D]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[#B38B4D]">
                  Welcome to The Crown Aesthetics
                </span>
              </div>
              
              <h3 className="text-3xl md:text-5xl font-bold text-[#F5F5F0] font-serif leading-tight">
                Where Beauty Meets Master Precision
              </h3>
              
              <p className="text-white/70 text-base leading-relaxed">
                Step into a world of pure indulgence and allow our award-winning stylists to transform your vision into reality. We combine timeless techniques with the finest European formulas to ensure you leave looking and feeling your absolute best.
              </p>
              
              <ul className="space-y-3 pt-2">
                {[
                  'Master Colorists & Precision Stylists',
                  '24K Gold Cellular Renewal Spa Treatments',
                  'Organic Hair & Scalp Aromatherapy Rituals',
                  'Personalized VIP Consultations & Care'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm font-medium text-white/90">
                    <div className="w-2 h-2 rounded-full bg-[#B38B4D] mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Link 
                  href="/about"
                  className="inline-flex items-center space-x-2 text-[#B38B4D] font-bold text-sm hover:underline"
                >
                  <span>Learn more about our salon</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Work - Interactive Swapping Circular Carousel Section */}
      <OurWorkCarousel />

      {/* What Our Patrons Say - Swapping Reviews Carousel */}
      <ReviewsCarousel initialReviews={reviews} />
    </div>
  );
}