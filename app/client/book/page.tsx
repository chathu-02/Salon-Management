"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DashboardLayout from '@/components/DashboardLayout';
import { Service } from '@/lib/types';
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
  ShieldCheck,
  AlertCircle,
  Lock,
} from "lucide-react";

function ClientBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get("service");
  const { user } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Step state: 1 = Service, 2 = Date & Time, 3 = Payment & Confirmation, 4 = Success
  const [step, setStep] = useState(1);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState("10:30");
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "CASH">("ONLINE");
  const [notes, setNotes] = useState("");

  // Simulated Online Card Form
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("123");

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
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: selectedService.id,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          payment_method: paymentMethod,
          notes,
        }),
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
    <DashboardLayout
      allowedRole="CLIENT"
      title="Reserve Your Salon Experience"
      subtitle="Select your preferred ritual, appointment time, and secure checkout method."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        
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
            <span className="text-xs font-bold truncate">1. Choose Service</span>
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
            <span className="text-xs font-bold truncate">3. Payment</span>
          </div>
        </div>

        {/* STEP 1: Select Service */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#F5F5F0] font-serif">
              Select Signature Treatment
            </h3>

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
                    className={`bg-[#021a12] border rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between ${
                      selectedService?.id === srv.id
                        ? "border-[#B38B4D] shadow-[0_0_20px_rgba(179,139,77,0.3)]"
                        : "border-[#B38B4D]/30 hover:border-[#B38B4D]/60"
                    }`}
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
                      <h4 className="text-lg font-bold text-[#F5F5F0] font-serif">{srv.name}</h4>
                      <p className="text-xs text-white/60 mt-1 leading-relaxed line-clamp-2">
                        {srv.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/10">
                      <span className="text-base font-bold text-[#F5F5F0] font-serif">
                        Rs. {srv.price.toLocaleString()}
                      </span>
                      <button className="text-xs font-bold text-[#021a12] bg-[#B38B4D] px-3.5 py-1.5 rounded-xl hover:brightness-110">
                        Select Ritual
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Select Date & Time */}
        {step === 2 && selectedService && (
          <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
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
              {/* Date Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1.5 text-[#B38B4D]" /> Select Appointment Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
                />
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-1.5 text-[#B38B4D]" /> Available Time Slots
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                Special Requests or Styling Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Let us know if you have specific preferences or allergies..."
                className="w-full px-4 py-2.5 bg-black/40 border border-[#B38B4D]/30 rounded-xl text-sm text-[#F5F5F0] focus:outline-none focus:border-[#B38B4D]"
              />
            </div>

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

        {/* STEP 3: Payment Method & Confirmation */}
        {step === 3 && selectedService && (
          <div className="bg-[#021a12] border border-[#B38B4D]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-xl font-bold text-[#F5F5F0] font-serif">
              Select Payment Method
            </h3>

            {bookingError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMethod("ONLINE")}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "ONLINE"
                    ? "bg-[#B38B4D]/20 border-[#B38B4D] shadow-lg"
                    : "bg-black/30 border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <CreditCard className="w-6 h-6 text-[#B38B4D]" />
                  <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                    Instant Confirmation
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#F5F5F0]">Pay Online (Card / Gateway)</h4>
                <p className="text-xs text-white/60 mt-1">
                  Pay securely now using Visa, Mastercard, or Amex.
                </p>
              </div>

              <div
                onClick={() => setPaymentMethod("CASH")}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "CASH"
                    ? "bg-[#B38B4D]/20 border-[#B38B4D] shadow-lg"
                    : "bg-black/30 border-white/10 hover:border-white/20"
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
                  Settle with Cash or Card POS directly at reception.
                </p>
              </div>
            </div>

            {/* Online Payment Card Form Simulation */}
            {paymentMethod === "ONLINE" && (
              <div className="p-5 rounded-2xl bg-black/40 border border-[#B38B4D]/30 space-y-4">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span className="flex items-center">
                    <Lock className="w-3.5 h-3.5 mr-1 text-emerald-400" /> 256-Bit SSL Encrypted Payment
                  </span>
                  <span className="text-[#B38B4D] font-bold">Stripe Gateway Demo</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-white/60 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#B38B4D]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-white/60 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#B38B4D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-white/60 mb-1">
                      Security Code (CVC)
                    </label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#B38B4D]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/50">Treatment:</span>
                <span className="font-bold text-[#F5F5F0]">{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Date & Slot:</span>
                <span className="font-bold text-[#F5F5F0]">{selectedDate} at {selectedTime}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5">
                <span className="text-sm font-bold text-white/80">Total Amount Due:</span>
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
                  <span>Securing Reservation...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{paymentMethod === "ONLINE" ? "Pay & Confirm Booking" : "Confirm Salon Reservation"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success Confirmation */}
        {step === 4 && confirmedBooking && (
          <div className="bg-[#021a12] border-2 border-[#B38B4D] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B38B4D]">
                Reservation Confirmed
              </span>
              <h2 className="text-3xl font-bold text-[#F5F5F0] font-serif mt-1">
                We Look Forward to Welcoming You
              </h2>
              <p className="text-xs text-white/60 mt-2 max-w-md mx-auto">
                A confirmation has been saved to your account. Our master stylists will prepare your personalized treatment ritual.
              </p>
            </div>

            <div className="bg-black/40 rounded-2xl p-5 max-w-md mx-auto text-left space-y-2 text-xs border border-white/10">
              <div className="flex justify-between">
                <span className="text-white/50">Treatment:</span>
                <span className="font-bold text-[#B38B4D]">{confirmedBooking.service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Scheduled Date:</span>
                <span className="font-bold text-white">{confirmedBooking.appointment_date} at {confirmedBooking.appointment_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Payment Status:</span>
                <span className="font-bold text-emerald-400">
                  {confirmedBooking.payment?.payment_status === "PAID" ? "PAID (Online Gateway)" : "PAY AT SALON"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Transaction Ref:</span>
                <span className="font-mono text-white/60">{confirmedBooking.payment?.transaction_id}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link
                href="/client/dashboard"
                className="px-6 py-3 rounded-xl bg-[#B38B4D] text-[#021a12] font-bold text-xs shadow-lg hover:brightness-110"
              >
                Go to Client Dashboard
              </Link>
              <Link
                href="/client/appointments"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                View My Bookings
              </Link>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default function ClientBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center bg-[#032B1E]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B38B4D]"></div>
      </div>
    }>
      <ClientBookingContent />
    </Suspense>
  );
}
