import Link from "next/link";
import { Scissors, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8 border-t border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img src="/images/logo/salonlogo.webp" alt="The Crown Aesthetics Logo" className="h-12 w-auto object-contain drop-shadow-md" />
              <span className="text-xl font-bold tracking-tight text-foreground font-serif">
                The Crown
              </span>
            </div>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed mb-6">
              Elevating beauty and style with our premium salon and spa services. Experience luxury redefined.
            </p>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                Instagram
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                Facebook
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                Twitter
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-6 font-serif">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-foreground font-semibold mb-6 font-serif">Our Services</h4>
            <ul className="space-y-4">
              <li className="text-secondary-foreground/70 text-sm">Hair Styling & Color</li>
              <li className="text-secondary-foreground/70 text-sm">Luxury Facials</li>
              <li className="text-secondary-foreground/70 text-sm">Manicure & Pedicure</li>
              <li className="text-secondary-foreground/70 text-sm">Bridal Packages</li>
              <li className="text-secondary-foreground/70 text-sm">Massage Therapy</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-foreground font-semibold mb-6 font-serif">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start text-secondary-foreground/70 text-sm">
                <MapPin className="h-4 w-4 mr-3 mt-0.5 text-primary shrink-0" />
                <span>123 Premium Ave,<br />Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex items-center text-secondary-foreground/70 text-sm">
                <Phone className="h-4 w-4 mr-3 text-primary shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center text-secondary-foreground/70 text-sm">
                <Mail className="h-4 w-4 mr-3 text-primary shrink-0" />
                <span>info@thecrownaesthetics.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary-foreground/50 text-xs mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} The Crown Aesthetics. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-secondary-foreground/50">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
