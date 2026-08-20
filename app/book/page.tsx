"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import {
  Scissors,
  Calendar as CalendarIcon,
  Clock,
  CreditCard,
  Banknote,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lock,
  AlertCircle,
  User,
} from "lucide-react";
import { Service } from '@/lib/types';

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get("service");
  const { user } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState("10:30");
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "CASH">("ONLINE");
  const [notes, setNotes] = useState("");

  // Walkin/Guest customer details if not logged in
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const timeSlots = [
    "09:30", "10:30", "11:30", "13:00", "14:00", "15:00", "16:30", "17:30", "18:30"
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        if (data.success) {
          setServices(data.data);
          if (preselectedServiceId) {
            const found = data.data.find((s: Service) => s.id === preselectedServiceId);
            if (found) {
              setSelectedService(found);
              setStep(2);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [preselectedServiceId]);

  const handleBookingSubmit = async () => {
    if (!selectedService) return;
    setBookingLoading(true);
    setBookingError("");

    try {
      const payload: any = {
        service_id: selectedService.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        payment_method: paymentMethod,
        notes,
      };

      if (!user) {
        if (!customerName || !customerPhone) {
          setBookingError("Please provide your name and phone number");
          setBookingLoading(false);
          return;
        }
        payload.custom_client_name = customerName;
        payload.custom_client_phone = customerPhone;
        payload.custom_client_email = customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '')}@guest.thecrown.com`;
      }

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmedBooking(data.data);
        setStep(4);
      } else {
        setBookingError(data.error || "Booking failed");
      }
    } catch (err: any) {
      setBookingError(err.message || "Network error");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#032B1E] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#B38B4D]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#021a12] border border-[#B38B4D]/40 rounded-full px-4 py-1.5 shadow-lg">
            <Sparkles className="w-4 h-4 text-[#B38B4D]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B38B4D]">
              Haute Coiffure & Spa Reservation
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#F5F5F0] font-serif">
            Reserve Your <span className="text-[#B38B4D] italic">Experience</span>
          </h1>
          <p className="text-sm text-white/60 max-w-lg mx-auto">
            Indulge in personalized aesthetic care crafted with European precision and world-class beauty rituals.
          </p>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className={`p-3 rounded-2xl border flex items-center space-x-3 transition-all ${
            step === 1
              ? "bg-[#B38B4D]/20 border-[#B38B4D] text-[#B38B4D]"
              : step > 1
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-black/30 border-white/10 text-white/40"
          }`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step > 1 ? "bg-emerald-500 text-black" : "bg-[#B38B4D] text-black"
            }`}>1</span>
            <span className="text-xs font-bold truncate">1. Service</span>
          </div>

          <div className={`p-3 rounded-2xl border flex items-center space-x-3 transition-all ${
            step === 2
              ? "bg-[#B38B4D]/20 border-[#B38B4D] text-[#B38B4D]"
              : step > 2
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-black/30 border-white/10 text-white/40"
          }`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step > 2 ? "bg-emerald-500 text-black" : "bg-[#B38B4D] text-black"
            }`}>2</span>
            <span className="text-xs font-bold truncate">2. Date & Time</span>
          </div>

          <div className={`p-3 rounded-2xl border flex items-center space-x-3 transition-all ${
            step >= 3
              ? "bg-[#B38B4D]/20 border-[#B38B4D] text-[#B38B4D]"
              : "bg-black/30 border-white/10 text-white/40"
          }`}>
            <span className="w-6 h-6 rounded-full bg-[#B38B4D] text-black flex items-center justify-center text-xs font-bold">3</span>
            <span className="text-xs font-bold truncate">3. Checkout</span>
          </div>
        </div>

        {/* STEP 1: Select Service */}
        {step === 1 && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B38B4D]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => {
                      setSelectedService(srv);
                      setStep(2);
                    }}
                    className="bg-[#021a12] border border-[#B38B4D]/30 hover:border-[#B38B4D] rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between group shadow-xl"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#B38B4D] bg-[#B38B4D]/10 px-2 py-0.5 rounded-full">
                          {srv.category}
                        </span>
                        <span className="text-xs text-white/60 font-mono">
                          {srv.duration_minutes} Mins
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-[#F5F5F0] font-serif group-hover:text-[#B38B4D] transition-colors">{srv.name}</h4>
                      <p className="text-xs text-white/60 mt-1 leading-relaxed line-clamp-2">
                        {srv.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/10">
                      <span className="text-base font-bold text-[#F5F5F0] font-serif">
                        Rs. {srv.price.toLocaleString()}
                      </span>
                      <button className="text-xs font-bold text-[#021a12] bg-[#B38B4D] px-4 py-2 rounded-xl group-hover:brightness-110">
                        Select Ritual
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Date & Time */}
        {step === 2 && selectedService && (
          <div className="bg-[#021a12] border border-[#B38B4D]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#B38B4D]/20 text-[#B38B4D] flex items-center justify-center">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#F5F5F0] font-serif">{selectedService.name}</h4>
                  <p className="text-xs text-[#B38B4D]">Rs. {selectedService.price.toLocaleString()} • {selectedService.duration_minutes} Mins</p>
                </div>
              </div>

              <button
                onClick={() => setStep(1)}
                className="text-xs text-white/60 hover:text-white underline"
              >
                Change Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1.5 text-[#B38B4D]" /> Select Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-1.5 text-[#B38B4D]" /> Select Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        selectedTime === slot
                          ? "bg-[#B38B4D] text-[#021a12] border-[#B38B4D] shadow-md"
                          : "bg-black/40 text-white/80 border-white/10 hover:border-[#B38B4D]/50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {!user && (
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B38B4D] block">
                  Guest / Customer Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-white/70 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#B38B4D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/70 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+94 77 123 4567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#B38B4D]"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-xs font-bold flex items-center space-x-2 shadow-lg"
              >
                <span>Continue to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Payment */}
        {step === 3 && selectedService && (
          <div className="bg-[#021a12] border border-[#B38B4D]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-[#F5F5F0] font-serif">
              Payment & Final Confirmation
            </h3>

            {bookingError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMethod("ONLINE")}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "ONLINE"
                    ? "bg-[#B38B4D]/20 border-[#B38B4D] shadow-lg"
                    : "bg-black/30 border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <CreditCard className="w-6 h-6 text-[#B38B4D]" />
                  <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                    Instant Card Checkout
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#F5F5F0]">Pay Online</h4>
                <p className="text-xs text-white/60 mt-1">
                  Card payment processed instantly with automated confirmation.
                </p>
              </div>

              <div
                onClick={() => setPaymentMethod("CASH")}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "CASH"
                    ? "bg-[#B38B4D]/20 border-[#B38B4D] shadow-lg"
                    : "bg-black/30 border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Banknote className="w-6 h-6 text-[#B38B4D]" />
                  <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                    Pay upon arrival
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#F5F5F0]">Pay at Salon Desk</h4>
                <p className="text-xs text-white/60 mt-1">
                  Settle your bill in Cash or POS Card with our receptionist.
                </p>
              </div>
            </div>

            {/* Total summary */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/50">Treatment:</span>
                <span className="font-bold text-[#F5F5F0]">{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Scheduled Slot:</span>
                <span className="font-bold text-[#F5F5F0]">{selectedDate} at {selectedTime}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5">
                <span className="text-sm font-bold text-white/80">Total Amount:</span>
                <span className="text-lg font-bold text-emerald-400 font-serif">
                  Rs. {selectedService.price.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleBookingSubmit}
                disabled={bookingLoading}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#B38B4D] to-[#c59e5f] hover:brightness-110 text-[#021a12] text-sm font-bold flex items-center space-x-2 shadow-xl hover:scale-105 transition-all"
              >
                {bookingLoading ? (
                  <span>Reserving...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Complete Booking</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success */}
        {step === 4 && confirmedBooking && (
          <div className="bg-[#021a12] border-2 border-[#B38B4D] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B38B4D]">
                Booking Confirmed
              </span>
              <h2 className="text-3xl font-bold text-[#F5F5F0] font-serif mt-1">
                Your Luxury Experience Awaits
              </h2>
              <p className="text-xs text-white/60 mt-2 max-w-md mx-auto">
                We have reserved your appointment slot. You may view or manage your booking anytime from your dashboard.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl bg-[#B38B4D] text-[#021a12] font-bold text-xs shadow-lg hover:brightness-110"
              >
                Sign In to View Dashboard
              </Link>
              <Link
                href="/"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center bg-[#032B1E]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B38B4D]"></div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
