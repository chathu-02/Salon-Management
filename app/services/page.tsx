"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Scissors,
  Sparkles,
  Clock,
  Filter,
  ArrowRight,
  Star,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
  Heart,
  Feather,
  X,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { Service } from "@/lib/types";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"RECOMMENDED" | "PRICE_ASC" | "PRICE_DESC" | "DURATION">("RECOMMENDED");

  // Selected Service for Detail Modal
  const [selectedServiceModal, setSelectedServiceModal] = useState<Service | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        if (data.success) {
          setServices(data.data);
        }
      } catch (err) {
        console.error("Failed to load services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const categories = [
    { id: "ALL", label: "All Offerings", icon: Sparkles, count: services.length },
    {
      id: "Hair Styling & Color",
      label: "Hair Styling & Color",
      icon: Scissors,
      count: services.filter((s) => s.category === "Hair Styling & Color").length,
    },
    {
      id: "Facials",
      label: "Facials",
      icon: Sparkles,
      count: services.filter((s) => s.category === "Facials").length,
      subcategories: [
        { id: "Luxury", label: "Luxury (24K Gold & Caviar)" },
        { id: "Normal", label: "Normal (Herbal & Deep Cleanse)" },
        { id: "Hydra", label: "Hydra-Dermabrasion & Oxygen" },
      ],
    },
    {
      id: "Manicure & Pedicure",
      label: "Manicure & Pedicure",
      icon: Feather,
      count: services.filter((s) => s.category === "Manicure & Pedicure").length,
    },
    {
      id: "Massage Therapy",
      label: "Massage Therapy",
      icon: Heart,
      count: services.filter((s) => s.category === "Massage Therapy").length,
      subcategories: [
        { id: "Foot", label: "Foot Reflexology Rituals" },
        { id: "Full Body", label: "Full Body Aromatherapy" },
        { id: "Head", label: "Head & Scalp Botanical" },
      ],
    },
    {
      id: "Threading",
      label: "Threading",
      icon: Zap,
      count: services.filter((s) => s.category === "Threading").length,
    },
  ];

  // Filter & Sort Logic
  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        // Category match
        if (selectedCategory !== "ALL" && service.category !== selectedCategory) {
          return false;
        }
        // Subcategory match
        if (
          selectedCategory !== "ALL" &&
          selectedSubcategory !== "ALL" &&
          service.subcategory !== selectedSubcategory
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "PRICE_ASC") return a.price - b.price;
        if (sortBy === "PRICE_DESC") return b.price - a.price;
        if (sortBy === "DURATION") return a.duration_minutes - b.duration_minutes;
        return 0; // RECOMMENDED
      });
  }, [services, selectedCategory, selectedSubcategory, sortBy]);

  const handleCategoryClick = (catId: string) => {
    if (selectedCategory === catId) {
      setSelectedSubcategory("ALL");
    } else {
      setSelectedCategory(catId);
      setSelectedSubcategory("ALL");
    }
  };

  const resetAllFilters = () => {
    setSelectedCategory("ALL");
    setSelectedSubcategory("ALL");
    setSortBy("RECOMMENDED");
  };

  const getSubcategoryBadgeColor = (sub?: string) => {
    switch (sub?.toLowerCase()) {
      case "luxury":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "hydra":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
      case "normal":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "full body":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "head":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "foot":
        return "bg-teal-500/20 text-teal-300 border-teal-500/40";
      default:
        return "bg-[#B38B4D]/20 text-[#B38B4D] border-[#B38B4D]/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#032B1E] text-[#F5F5F0]">
      
      <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        
        {/* Header & Sorting Bar */}
        <div className="bg-[#021a12] border border-[#B38B4D]/30 p-4 sm:p-6 rounded-3xl shadow-2xl flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#B38B4D]" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#F5F5F0] font-serif">
                Salon Rituals & Treatments
              </h2>
            </div>
            <p className="text-xs text-white/60">
              Showing <strong className="text-[#B38B4D]">{filteredServices.length}</strong> treatments
              {selectedCategory !== "ALL" && (
                <span className="ml-2 inline-flex items-center bg-[#B38B4D]/20 text-[#B38B4D] px-2 py-0.5 rounded-full text-[11px] font-medium">
                  {selectedCategory} {selectedSubcategory !== "ALL" ? `› ${selectedSubcategory}` : ""}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            {(selectedCategory !== "ALL" || selectedSubcategory !== "ALL" || sortBy !== "RECOMMENDED") && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-[#B38B4D] hover:text-[#c59e5f] font-semibold flex items-center space-x-1 hover:underline mr-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-[#B38B4D]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-black/50 border border-[#B38B4D]/40 text-xs text-[#F5F5F0] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#B38B4D] cursor-pointer"
              >
                <option value="RECOMMENDED">Featured & Recommended</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
                <option value="DURATION">Duration: Shortest to Longest</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT: Sidebar Categories on Left + Services Grid on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: Vertical Category Hierarchy List */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-[#B38B4D]" />
                  <h3 className="font-bold text-sm uppercase tracking-wider text-[#F5F5F0] font-serif">
                    Categories
                  </h3>
                </div>
                <span className="text-[11px] text-white/50">{categories.length - 1} Departments</span>
              </div>

              {/* Vertical Category Items */}
              <div className="space-y-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isCatSelected = selectedCategory === cat.id;

                  return (
                    <div key={cat.id} className="space-y-1.5">
                      <button
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all border text-left ${
                          isCatSelected
                            ? "bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] text-[#021a12] border-[#B38B4D] shadow-[0_0_15px_rgba(179,139,77,0.25)] font-semibold"
                            : "bg-black/30 text-white/80 border-white/5 hover:border-[#B38B4D]/40 hover:bg-black/50 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-4 h-4 ${isCatSelected ? "text-[#021a12]" : "text-[#B38B4D]"}`} />
                          <span>{cat.label}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                          isCatSelected ? "bg-[#021a12]/20 text-[#021a12]" : "bg-white/5 text-[#B38B4D]"
                        }`}>
                          {cat.count}
                        </span>
                      </button>

                      {/* Subcategories Vertical Accordion/Indent */}
                      {cat.subcategories && isCatSelected && (
                        <div className="pl-4 pr-1 py-1.5 space-y-1 border-l-2 border-[#B38B4D]/40 ml-4 animate-fadeIn">
                          <button
                            onClick={() => setSelectedSubcategory("ALL")}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-semibold transition-all ${
                              selectedSubcategory === "ALL"
                                ? "bg-[#B38B4D]/20 text-[#B38B4D] border border-[#B38B4D]/40 font-bold"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <span>All {cat.label}</span>
                            {selectedSubcategory === "ALL" && <ChevronRight className="w-3 h-3 text-[#B38B4D]" />}
                          </button>

                          {cat.subcategories.map((sub) => {
                            const isSubSelected = selectedSubcategory === sub.id;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => setSelectedSubcategory(sub.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-semibold transition-all ${
                                  isSubSelected
                                    ? "bg-[#B38B4D]/20 text-[#B38B4D] border border-[#B38B4D]/40 font-bold"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                                }`}
                              >
                                <span>{sub.label}</span>
                                {isSubSelected && <ChevronRight className="w-3 h-3 text-[#B38B4D]" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Salon Guarantee Banner */}
            <div className="bg-[#021a12] border border-[#B38B4D]/20 rounded-3xl p-5 shadow-xl space-y-3 text-xs text-white/70">
              <h4 className="font-bold text-[#F5F5F0] font-serif flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#B38B4D]" />
                <span>The Crown Guarantee</span>
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li className="flex items-center">✓ Certified Master Stylists & Therapists</li>
                <li className="flex items-center">✓ Pure Botanical & Premium European Formulas</li>
                <li className="flex items-center">✓ Punctual, Private VIP Spa Suites</li>
                <li className="flex items-center">✓ Complimentary Consultation with Every Booking</li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Service Cards Grid */}
          <div className="lg:col-span-8 space-y-6">
            
            {loading ? (
              <div className="flex justify-center py-24 bg-[#021a12] rounded-3xl border border-[#B38B4D]/20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#B38B4D]"></div>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="p-16 text-center text-white/60 bg-[#021a12] rounded-3xl border border-[#B38B4D]/30 space-y-3 shadow-xl">
                <Scissors className="w-12 h-12 mx-auto text-white/20" />
                <h3 className="text-lg font-bold text-white/80 font-serif">No treatments available</h3>
                <p className="text-xs max-w-sm mx-auto">
                  No services found for the selected category.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="mt-3 px-5 py-2 rounded-xl bg-[#B38B4D] text-[#021a12] text-xs font-bold hover:brightness-110"
                >
                  View All Services
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="group relative bg-[#021a12] border border-[#B38B4D]/30 rounded-3xl p-5 hover:border-[#B38B4D] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Image with Category Badges */}
                      <div className="h-44 rounded-2xl overflow-hidden mb-4 relative bg-black/50 border border-white/5">
                        <img
                          src={service.image_url}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[#B38B4D] border border-[#B38B4D]/40">
                            {service.category}
                          </span>
                          {service.subcategory && (
                            <span className={`text-[10px] font-bold uppercase tracking-wider backdrop-blur-md px-2.5 py-1 rounded-full border ${getSubcategoryBadgeColor(service.subcategory)}`}>
                              {service.subcategory}
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[11px] font-semibold text-white/90 flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-[#B38B4D]" />
                          {service.duration_minutes} Mins
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-[#F5F5F0] font-serif mb-2 group-hover:text-[#B38B4D] transition-colors leading-snug">
                        {service.name}
                      </h3>

                      <p className="text-xs text-white/60 leading-relaxed mb-6 line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-end justify-between pt-4 border-t border-white/10 mb-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-white/40 block">Price</span>
                          <span className="text-xl font-bold text-[#F5F5F0] font-serif">
                            Rs. {service.price.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex space-x-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedServiceModal(service)}
                          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold border border-white/10 transition-colors"
                        >
                          Details
                        </button>

                        <Link
                          href={`/book?service=${service.id}`}
                          className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold shadow-md hover:scale-[1.02] transition-all flex items-center justify-center space-x-1"
                        >
                          <span>Book</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Service Detail Modal */}
      {selectedServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#021a12] border border-[#B38B4D]/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B38B4D] bg-[#B38B4D]/10 px-2.5 py-0.5 rounded-full">
                  {selectedServiceModal.category} {selectedServiceModal.subcategory ? `• ${selectedServiceModal.subcategory}` : ""}
                </span>
                <h3 className="text-2xl font-bold text-[#F5F5F0] font-serif mt-2">
                  {selectedServiceModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedServiceModal(null)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white bg-white/5 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-44 rounded-2xl overflow-hidden relative">
              <img
                src={selectedServiceModal.image_url}
                alt={selectedServiceModal.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-white/80 leading-relaxed">
                {selectedServiceModal.description}
              </p>

              <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/50">Estimated Duration:</span>
                  <span className="font-bold text-white">{selectedServiceModal.duration_minutes} Minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Treatment Price:</span>
                  <span className="font-bold text-emerald-400 text-sm font-serif">Rs. {selectedServiceModal.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Includes:</span>
                  <span className="text-white/80">Complimentary consultation & aftercare advice</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedServiceModal(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
              >
                Close
              </button>
              <Link
                href={`/book?service=${selectedServiceModal.id}`}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold shadow-lg"
              >
                Proceed to Reservation
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
