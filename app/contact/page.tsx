"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus({ type: "success", message: "Thank you for your message! We will get back to you shortly." });
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-lg text-gray-400 font-light max-w-2xl mx-auto">
            Have a question about our services or want to provide feedback? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Information & Map */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">Contact Information</h2>
            
            <div className="space-y-8 mb-10">
              <div className="flex items-start">
                <div className="bg-primary/10 p-4 rounded-full mr-6">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Our Location</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    123 Premium Avenue,<br />
                    Colombo 03,<br />
                    Sri Lanka
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-4 rounded-full mr-6">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Phone Number</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    +94 11 234 5678<br />
                    +94 77 123 4567
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary/10 p-4 rounded-full mr-6">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Email Address</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    info@thecrownaesthetics.com<br />
                    bookings@thecrownaesthetics.com
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary/10 p-4 rounded-full mr-6">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Opening Hours</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Monday - Friday: 9:00 AM - 8:00 PM<br />
                    Saturday - Sunday: 10:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-64 bg-muted rounded-2xl overflow-hidden border border-border relative">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" 
                alt="Map View" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center backdrop-blur-[2px]">
                <div className="bg-background px-6 py-3 rounded-full text-foreground font-medium flex items-center shadow-lg border border-border">
                  <MapPin className="w-5 h-5 text-primary mr-2" />
                  Interactive Map Integration
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="text-3xl font-bold text-foreground mb-2 relative z-10">Send an Inquiry</h2>
            <p className="text-muted-foreground mb-8 relative z-10">We usually respond within 24 hours.</p>

            {status.type === "success" ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-xl p-6 text-center text-green-700 dark:text-green-400">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <p className="font-medium text-lg">{status.message}</p>
                <button 
                  onClick={() => setStatus({ type: "", message: "" })}
                  className="mt-6 text-sm font-semibold underline hover:text-green-800 dark:hover:text-green-300"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-xl flex justify-center items-center space-x-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
