import fs from 'fs';
import path from 'path';
import { User, Service, Appointment, Payment, Review, UserRole, AppointmentStatus, PaymentStatus, PaymentMethod } from './types';

// Precomputed bcrypt hashes for demo passwords:
// Owner@123 -> $2a$10$wO3iX5E9uQ4u1n0rB3Jj3uN6u7s6uH0jA3e3p9qE1i2a3b4c5d6e7 (or dynamically hashed upon init)
// Let's create an auto-initializing database JSON in data/salon_db.json

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'salon_db.json');

interface DatabaseSchema {
  users: User[];
  services: Service[];
  appointments: Appointment[];
  payments: Payment[];
  reviews: Review[];
}

const DEFAULT_SERVICES: Service[] = [
  // 1. Hair Styling & Color
  {
    id: 'srv-1',
    name: 'Crown Royal Haircut & Master Blowdry',
    category: 'Hair Styling & Color',
    subcategory: 'Styling',
    price: 3500,
    duration_minutes: 45,
    description: 'Precision shear cutting, scalp revitalizing wash, blow dry and master luxury styling.',
    image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-2',
    name: 'French Balayage & Ammonia-Free Gloss',
    category: 'Hair Styling & Color',
    subcategory: 'Color',
    price: 14500,
    duration_minutes: 120,
    description: 'Hand-painted dimensional highlighting accompanied by gloss toner and deep conditioning cure.',
    image_url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-3',
    name: 'Brazilian Keratin Smoothing & Restoration',
    category: 'Hair Styling & Color',
    subcategory: 'Treatment',
    price: 18000,
    duration_minutes: 90,
    description: 'Intense Brazilian keratin infusion to eliminate frizz, seal cuticles, and deliver diamond mirror shine.',
    image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-4',
    name: 'Root Touchup & Organic Color Gloss',
    category: 'Hair Styling & Color',
    subcategory: 'Color',
    price: 6500,
    duration_minutes: 60,
    description: 'Seamless grey coverage and scalp nourishing organic dye infusion with shine treatment.',
    image_url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },

  // 2. Facials (Luxury, Normal, Hydra)
  {
    id: 'srv-5',
    name: '24K Pure Gold Cellular Renewal Facial',
    category: 'Facials',
    subcategory: 'Luxury',
    price: 12500,
    duration_minutes: 75,
    description: 'Anti-aging cellular renewal treatment infused with pure 24K gold foil, hyaluronic serum and jade roller massage.',
    image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-6',
    name: 'Imperial Caviar & Collagen Radiance Facial',
    category: 'Facials',
    subcategory: 'Luxury',
    price: 15000,
    duration_minutes: 90,
    description: 'Luxury French black caviar extract infused with marine collagen for skin plumping and cellular firming.',
    image_url: 'https://images.unsplash.com/photo-1512290900672-1f02e600572e?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-7',
    name: 'Deep Pore Cleansing & Herbal Botanical Facial',
    category: 'Facials',
    subcategory: 'Normal',
    price: 4500,
    duration_minutes: 50,
    description: 'Steam pore extraction, natural herbal mud mask, toner balancing and lymphatic face drainage.',
    image_url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-8',
    name: 'Vitamin C Fruit Glow & Brightening Facial',
    category: 'Facials',
    subcategory: 'Normal',
    price: 5500,
    duration_minutes: 60,
    description: 'Antioxidant concentrated citrus peel, active Vitamin C infusion and brightening glow mask.',
    image_url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-9',
    name: 'Hydra-Dermabrasion Deep Infusion Facial',
    category: 'Facials',
    subcategory: 'Hydra',
    price: 9500,
    duration_minutes: 60,
    description: 'Vortex vacuum suction exfoliation, peptide hydration infusion and blue LED calming therapy.',
    image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-10',
    name: 'Aqua Oxygen Jet Hydration & Glow Protocol',
    category: 'Facials',
    subcategory: 'Hydra',
    price: 11000,
    duration_minutes: 75,
    description: 'High-pressure oxygen serum blast for intense hydration, fine line reduction, and dewy glass skin finish.',
    image_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },

  // 3. Manicure & Pedicure
  {
    id: 'srv-11',
    name: 'Royal Velvet Gel Manicure & Hand Spa',
    category: 'Manicure & Pedicure',
    subcategory: 'Manicure',
    price: 4200,
    duration_minutes: 45,
    description: 'Cuticle restoration, organic sugar scrub, hot stone hand massage and long-lasting artisan gel polish.',
    image_url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-12',
    name: 'Deluxe Moroccan Pedicure & Heel Therapy',
    category: 'Manicure & Pedicure',
    subcategory: 'Pedicure',
    price: 5200,
    duration_minutes: 60,
    description: 'Eucalyptus foot soak, callus smoothing, Moroccan argan oil massage and precision toe nail styling.',
    image_url: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-13',
    name: 'Signature Crown Mani-Pedi Duo Ritual',
    category: 'Manicure & Pedicure',
    subcategory: 'Combo',
    price: 8500,
    duration_minutes: 90,
    description: 'Complete hands and feet luxury package with paraffin wax therapy, scrub, massage, and premium polish.',
    image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },

  // 4. Massage Therapy (Foot, Full Body, Head)
  {
    id: 'srv-14',
    name: 'Botanical Hot Oil Scalp & Head Acupressure',
    category: 'Massage Therapy',
    subcategory: 'Head',
    price: 3800,
    duration_minutes: 40,
    description: 'Warm ayurvedic herbal oil application, pressure point stimulation, and hot towel temple massage.',
    image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-15',
    name: 'Thai Herbal Reflexology Foot Massage',
    category: 'Massage Therapy',
    subcategory: 'Foot',
    price: 4200,
    duration_minutes: 45,
    description: 'Ancient reflex zone therapy using teakwood stick and warm peppermint balm to revitalize tired feet.',
    image_url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-16',
    name: 'Swedish Aromatherapy Full Body Massage',
    category: 'Massage Therapy',
    subcategory: 'Full Body',
    price: 9000,
    duration_minutes: 60,
    description: 'Full-body relaxation therapy with organic lavender and eucalyptus oils to ease tension and promote deep sleep.',
    image_url: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-17',
    name: 'Deep Tissue & Volcanic Stone Body Ritual',
    category: 'Massage Therapy',
    subcategory: 'Full Body',
    price: 13500,
    duration_minutes: 90,
    description: 'Heated volcanic basalt stones combined with deep muscular pressure to melt stubborn knots and tension.',
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },

  // 5. Threading
  {
    id: 'srv-18',
    name: 'Signature Eyebrow Precision Threading',
    category: 'Threading',
    subcategory: 'Face',
    price: 600,
    duration_minutes: 15,
    description: 'Master symmetrical eyebrow shaping with organic cotton thread and soothing aloe vera balm.',
    image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-19',
    name: 'Upper Lip, Chin & Forehead Threading',
    category: 'Threading',
    subcategory: 'Face',
    price: 1000,
    duration_minutes: 20,
    description: 'Clean hair removal for upper lip, chin and forehead with calming rosewater compress.',
    image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'srv-20',
    name: 'Full Face Herbal Threading & Soothing Gel',
    category: 'Threading',
    subcategory: 'Face',
    price: 2200,
    duration_minutes: 35,
    description: 'Comprehensive full-facial threading followed by antibacterial tea-tree and cold jade roller finish.',
    image_url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
];

// Hash for standard demo password 'Owner@123', 'Reception@123', 'Client@123'
// $2a$10$tZ2E6p6B8f0a3yG5.qM86.uC7pI3E8B6P/RzY4T8d.U9d8f7h9j12 -> we will hash dynamically or support clear fallback
import bcrypt from 'bcryptjs';

const DEMO_OWNER_HASH = bcrypt.hashSync('Owner@123', 10);
const DEMO_RECEPTION_HASH = bcrypt.hashSync('Reception@123', 10);
const DEMO_CLIENT_HASH = bcrypt.hashSync('Client@123', 10);

const DEFAULT_USERS: User[] = [
  {
    id: 'usr-owner-1',
    name: 'Alexander Sterling',
    email: 'owner@thecrown.com',
    password_hash: DEMO_OWNER_HASH,
    role: 'OWNER',
    phone: '+94 77 123 4567',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-reception-1',
    name: 'Elena Rostova',
    email: 'receptionist@thecrown.com',
    password_hash: DEMO_RECEPTION_HASH,
    role: 'RECEPTIONIST',
    phone: '+94 77 234 5678',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 'usr-reception-2',
    name: 'Marco Silva',
    email: 'marco@thecrown.com',
    password_hash: DEMO_RECEPTION_HASH,
    role: 'RECEPTIONIST',
    phone: '+94 77 345 6789',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'usr-client-1',
    name: 'Sophia Vance',
    email: 'client@thecrown.com',
    password_hash: DEMO_CLIENT_HASH,
    role: 'CLIENT',
    phone: '+94 71 888 9999',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'usr-client-2',
    name: 'Liam Hemsworth',
    email: 'liam@example.com',
    password_hash: DEMO_CLIENT_HASH,
    role: 'CLIENT',
    phone: '+94 76 555 4321',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-01-20T00:00:00.000Z',
  },
  {
    id: 'usr-client-3',
    name: 'Isabella Mendes',
    email: 'isabella@example.com',
    password_hash: DEMO_CLIENT_HASH,
    role: 'CLIENT',
    phone: '+94 70 444 1122',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
    is_active: true,
    created_at: '2026-02-01T00:00:00.000Z',
  }
];

const todayDate = new Date().toISOString().split('T')[0];

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    client_id: 'usr-client-1',
    client_name: 'Sophia Vance',
    client_email: 'client@thecrown.com',
    client_phone: '+94 71 888 9999',
    service_id: 'srv-1',
    appointment_date: todayDate,
    appointment_time: '10:30',
    status: 'CONFIRMED',
    notes: 'Preferred warm water scalp rinse',
    payment_id: 'pay-101',
    created_at: '2026-08-18T10:00:00.000Z',
  },
  {
    id: 'apt-102',
    client_id: 'usr-client-2',
    client_name: 'Liam Hemsworth',
    client_email: 'liam@example.com',
    client_phone: '+94 76 555 4321',
    service_id: 'srv-3',
    appointment_date: todayDate,
    appointment_time: '14:00',
    status: 'PENDING',
    notes: 'First time facial treatment',
    payment_id: 'pay-102',
    created_at: '2026-08-19T08:30:00.000Z',
  },
  {
    id: 'apt-103',
    client_id: 'usr-client-3',
    client_name: 'Isabella Mendes',
    client_email: 'isabella@example.com',
    client_phone: '+94 70 444 1122',
    service_id: 'srv-2',
    appointment_date: '2026-08-25',
    appointment_time: '11:00',
    status: 'CONFIRMED',
    notes: 'Ash blonde balayage consultation',
    payment_id: 'pay-103',
    created_at: '2026-08-19T14:00:00.000Z',
  },
  {
    id: 'apt-104',
    client_id: 'usr-client-1',
    client_name: 'Sophia Vance',
    client_email: 'client@thecrown.com',
    client_phone: '+94 71 888 9999',
    service_id: 'srv-3',
    appointment_date: '2026-08-10',
    appointment_time: '15:30',
    status: 'COMPLETED',
    notes: 'Completed beautifully',
    payment_id: 'pay-104',
    review_submitted: true,
    created_at: '2026-08-08T09:00:00.000Z',
  },
  {
    id: 'apt-105',
    client_id: 'usr-client-2',
    client_name: 'Liam Hemsworth',
    client_email: 'liam@example.com',
    client_phone: '+94 76 555 4321',
    service_id: 'srv-1',
    appointment_date: '2026-08-12',
    appointment_time: '16:00',
    status: 'COMPLETED',
    notes: 'Gentleman haircut',
    payment_id: 'pay-105',
    review_submitted: true,
    created_at: '2026-08-10T11:20:00.000Z',
  },
  {
    id: 'apt-106',
    client_id: 'usr-client-3',
    client_name: 'Isabella Mendes',
    client_email: 'isabella@example.com',
    client_phone: '+94 70 444 1122',
    service_id: 'srv-6',
    appointment_date: '2026-08-15',
    appointment_time: '13:00',
    status: 'CANCELLED',
    notes: 'Client requested reschedule due to flight',
    payment_id: 'pay-106',
    created_at: '2026-08-12T10:00:00.000Z',
  },
];

const DEFAULT_PAYMENTS: Payment[] = [
  {
    id: 'pay-101',
    appointment_id: 'apt-101',
    client_id: 'usr-client-1',
    client_name: 'Sophia Vance',
    amount: 3500,
    payment_method: 'CASH',
    payment_status: 'PENDING',
    transaction_id: 'TXN-SALON-101',
    paid_at: null,
    created_at: '2026-08-18T10:00:00.000Z',
  },
  {
    id: 'pay-102',
    appointment_id: 'apt-102',
    client_id: 'usr-client-2',
    client_name: 'Liam Hemsworth',
    amount: 9500,
    payment_method: 'CARD',
    payment_status: 'PENDING',
    transaction_id: 'TXN-SALON-102',
    paid_at: null,
    created_at: '2026-08-19T08:30:00.000Z',
  },
  {
    id: 'pay-103',
    appointment_id: 'apt-103',
    client_id: 'usr-client-3',
    client_name: 'Isabella Mendes',
    amount: 14500,
    payment_method: 'ONLINE',
    payment_status: 'PAID',
    transaction_id: 'TXN-STRIPE-8934',
    paid_at: '2026-08-19T14:05:00.000Z',
    created_at: '2026-08-19T14:00:00.000Z',
  },
  {
    id: 'pay-104',
    appointment_id: 'apt-104',
    client_id: 'usr-client-1',
    client_name: 'Sophia Vance',
    amount: 9500,
    payment_method: 'ONLINE',
    payment_status: 'PAID',
    transaction_id: 'TXN-STRIPE-5431',
    paid_at: '2026-08-10T16:45:00.000Z',
    created_at: '2026-08-08T09:00:00.000Z',
  },
  {
    id: 'pay-105',
    appointment_id: 'apt-105',
    client_id: 'usr-client-2',
    client_name: 'Liam Hemsworth',
    amount: 3500,
    payment_method: 'CASH',
    payment_status: 'PAID',
    transaction_id: 'TXN-CASH-9912',
    paid_at: '2026-08-12T16:50:00.000Z',
    created_at: '2026-08-10T11:20:00.000Z',
  },
  {
    id: 'pay-106',
    appointment_id: 'apt-106',
    client_id: 'usr-client-3',
    client_name: 'Isabella Mendes',
    amount: 4200,
    payment_method: 'ONLINE',
    payment_status: 'REFUNDED',
    transaction_id: 'TXN-REF-1092',
    paid_at: null,
    created_at: '2026-08-12T10:00:00.000Z',
  },
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    appointment_id: 'apt-104',
    client_id: 'usr-client-1',
    client_name: 'Sophia Vance',
    client_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop',
    service_id: 'srv-5',
    service_name: '24K Pure Gold Cellular Renewal Facial',
    rating: 5,
    comment: 'The 24K Gold Facial was sheer perfection. My skin felt illuminated and firm for over a week! The VIP ambiance and tea service are unmatched.',
    created_at: '2026-08-11T10:30:00.000Z',
  },
  {
    id: 'rev-2',
    appointment_id: 'apt-105',
    client_id: 'usr-client-2',
    client_name: 'Liam Hemsworth',
    client_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    service_id: 'srv-1',
    service_name: 'Crown Royal Haircut & Master Blowdry',
    rating: 5,
    comment: 'Best haircut experience in Colombo. Unbelievable attention to detail and sharp styling by the master stylist.',
    created_at: '2026-08-13T12:00:00.000Z',
  },
  {
    id: 'rev-3',
    appointment_id: 'apt-106',
    client_id: 'usr-client-3',
    client_name: 'Isabella Mendes',
    client_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    service_id: 'srv-2',
    service_name: 'French Balayage & Ammonia-Free Gloss',
    rating: 5,
    comment: 'The color blending is gorgeous! Zero brassiness, and my hair feels softer than before. I get compliments everywhere I go.',
    created_at: '2026-08-15T15:30:00.000Z',
  },
  {
    id: 'rev-4',
    appointment_id: 'apt-107',
    client_id: 'usr-client-4',
    client_name: 'Charlotte Dubois',
    client_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
    service_id: 'srv-16',
    service_name: 'Swedish Aromatherapy Full Body Massage',
    rating: 5,
    comment: 'Pure bliss and rejuvenation. The therapist listened to my pressure preferences and the lavender oils melted all my shoulder tension.',
    created_at: '2026-08-17T11:00:00.000Z',
  },
  {
    id: 'rev-5',
    appointment_id: 'apt-108',
    client_id: 'usr-client-5',
    client_name: 'Elena Rostova',
    client_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
    service_id: 'srv-11',
    service_name: 'Royal Velvet Gel Manicure & Hand Spa',
    rating: 5,
    comment: 'The cuticle care and hot stone hand massage were exceptional. The gel polish still looks fresh after three weeks!',
    created_at: '2026-08-18T16:20:00.000Z',
  },
];

function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      users: DEFAULT_USERS,
      services: DEFAULT_SERVICES,
      appointments: DEFAULT_APPOINTMENTS,
      payments: DEFAULT_PAYMENTS,
      reviews: DEFAULT_REVIEWS,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw) as DatabaseSchema;
  } catch (error) {
    const fallback: DatabaseSchema = {
      users: DEFAULT_USERS,
      services: DEFAULT_SERVICES,
      appointments: DEFAULT_APPOINTMENTS,
      payments: DEFAULT_PAYMENTS,
      reviews: DEFAULT_REVIEWS,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

function saveDatabase(data: DatabaseSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Database helper operations
export const db = {
  // USER OPERATIONS
  getUsers: (): User[] => {
    const data = initDatabase();
    return data.users.map(({ password_hash, ...rest }) => rest as User);
  },

  getUserByEmail: (email: string): User | undefined => {
    const data = initDatabase();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  getUserById: (id: string): User | undefined => {
    const data = initDatabase();
    return data.users.find((u) => u.id === id);
  },

  createUser: (user: Omit<User, 'id' | 'created_at'>): User => {
    const data = initDatabase();
    const newUser: User = {
      ...user,
      id: 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      created_at: new Date().toISOString(),
    };
    data.users.push(newUser);
    saveDatabase(data);
    const { password_hash, ...safeUser } = newUser;
    return safeUser as User;
  },

  updateUser: (id: string, updates: Partial<User>): User | null => {
    const data = initDatabase();
    const index = data.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    data.users[index] = { ...data.users[index], ...updates };
    saveDatabase(data);
    const { password_hash, ...safeUser } = data.users[index];
    return safeUser as User;
  },

  deleteUser: (id: string): boolean => {
    const data = initDatabase();
    const initialLength = data.users.length;
    data.users = data.users.filter((u) => u.id !== id);
    if (data.users.length !== initialLength) {
      saveDatabase(data);
      return true;
    }
    return false;
  },

  // SERVICES OPERATIONS
  getServices: (onlyActive: boolean = false): Service[] => {
    const data = initDatabase();
    return onlyActive ? data.services.filter((s) => s.is_active) : data.services;
  },

  getServiceById: (id: string): Service | undefined => {
    const data = initDatabase();
    return data.services.find((s) => s.id === id);
  },

  createService: (service: Omit<Service, 'id' | 'created_at'>): Service => {
    const data = initDatabase();
    const newService: Service = {
      ...service,
      id: 'srv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      created_at: new Date().toISOString(),
    };
    data.services.push(newService);
    saveDatabase(data);
    return newService;
  },

  updateService: (id: string, updates: Partial<Service>): Service | null => {
    const data = initDatabase();
    const index = data.services.findIndex((s) => s.id === id);
    if (index === -1) return null;

    data.services[index] = { ...data.services[index], ...updates };
    saveDatabase(data);
    return data.services[index];
  },

  deleteService: (id: string): boolean => {
    const data = initDatabase();
    const index = data.services.findIndex((s) => s.id === id);
    if (index === -1) return false;
    // Soft deactivate or remove
    data.services.splice(index, 1);
    saveDatabase(data);
    return true;
  },

  // APPOINTMENTS OPERATIONS
  getAppointments: (filter?: {
    clientId?: string;
    date?: string;
    status?: AppointmentStatus;
    search?: string;
  }): Appointment[] => {
    const data = initDatabase();
    let result = data.appointments;

    if (filter?.clientId) {
      result = result.filter((a) => a.client_id === filter.clientId);
    }
    if (filter?.date) {
      result = result.filter((a) => a.appointment_date === filter.date);
    }
    if (filter?.status) {
      result = result.filter((a) => a.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.client_name?.toLowerCase().includes(q) ||
          a.client_email?.toLowerCase().includes(q) ||
          a.client_phone?.toLowerCase().includes(q)
      );
    }

    // Populate service & payment details
    return result.map((apt) => {
      const srv = data.services.find((s) => s.id === apt.service_id);
      const pay = data.payments.find((p) => p.appointment_id === apt.id);
      return {
        ...apt,
        service: srv,
        payment: pay,
      };
    }).sort((a, b) => new Date(`${b.appointment_date}T${b.appointment_time || '00:00'}`).getTime() - new Date(`${a.appointment_date}T${a.appointment_time || '00:00'}`).getTime());
  },

  getAppointmentById: (id: string): Appointment | undefined => {
    const data = initDatabase();
    const apt = data.appointments.find((a) => a.id === id);
    if (!apt) return undefined;
    const srv = data.services.find((s) => s.id === apt.service_id);
    const pay = data.payments.find((p) => p.appointment_id === apt.id);
    return {
      ...apt,
      service: srv,
      payment: pay,
    };
  },

  createAppointment: (apt: Omit<Appointment, 'id' | 'created_at'>): Appointment => {
    const data = initDatabase();
    const newApt: Appointment = {
      ...apt,
      id: 'apt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      created_at: new Date().toISOString(),
    };
    data.appointments.push(newApt);
    saveDatabase(data);
    return newApt;
  },

  updateAppointment: (id: string, updates: Partial<Appointment>): Appointment | null => {
    const data = initDatabase();
    const index = data.appointments.findIndex((a) => a.id === id);
    if (index === -1) return null;

    data.appointments[index] = { ...data.appointments[index], ...updates };
    saveDatabase(data);
    return data.appointments[index];
  },

  // PAYMENTS OPERATIONS
  getPayments: (filter?: { clientId?: string; status?: PaymentStatus }): Payment[] => {
    const data = initDatabase();
    let result = data.payments;
    if (filter?.clientId) {
      result = result.filter((p) => p.client_id === filter.clientId);
    }
    if (filter?.status) {
      result = result.filter((p) => p.payment_status === filter.status);
    }
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  createPayment: (payment: Omit<Payment, 'id' | 'created_at'>): Payment => {
    const data = initDatabase();
    const newPayment: Payment = {
      ...payment,
      id: 'pay-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      created_at: new Date().toISOString(),
    };
    data.payments.push(newPayment);
    saveDatabase(data);
    return newPayment;
  },

  updatePayment: (id: string, updates: Partial<Payment>): Payment | null => {
    const data = initDatabase();
    const index = data.payments.findIndex((p) => p.id === id);
    if (index === -1) return null;

    data.payments[index] = { ...data.payments[index], ...updates };
    saveDatabase(data);
    return data.payments[index];
  },

  // REVIEWS OPERATIONS
  getReviews: (serviceId?: string): Review[] => {
    const data = initDatabase();
    let result = data.reviews;
    if (serviceId) {
      result = result.filter((r) => r.service_id === serviceId);
    }
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  createReview: (review: Omit<Review, 'id' | 'created_at'>): Review => {
    const data = initDatabase();
    const newReview: Review = {
      ...review,
      id: 'rev-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      created_at: new Date().toISOString(),
    };
    data.reviews.push(newReview);
    
    // Mark appointment review_submitted = true
    const aptIndex = data.appointments.findIndex((a) => a.id === review.appointment_id);
    if (aptIndex !== -1) {
      data.appointments[aptIndex].review_submitted = true;
    }

    saveDatabase(data);
    return newReview;
  },

  // ANALYTICS & STATS
  getOwnerStats: () => {
    const data = initDatabase();
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const totalAppointments = data.appointments.length;
    const todayAppointments = data.appointments.filter((a) => a.appointment_date === today).length;
    const upcomingAppointments = data.appointments.filter(
      (a) => a.appointment_date >= today && (a.status === 'CONFIRMED' || a.status === 'PENDING')
    ).length;
    const completedAppointments = data.appointments.filter((a) => a.status === 'COMPLETED').length;
    const totalClients = data.users.filter((u) => u.role === 'CLIENT').length;

    // Revenue calculations
    const paidPayments = data.payments.filter((p) => p.payment_status === 'PAID');
    const todayRevenue = paidPayments
      .filter((p) => p.paid_at && p.paid_at.startsWith(today))
      .reduce((sum, p) => sum + p.amount, 0);

    const monthlyRevenue = paidPayments
      .filter((p) => {
        if (!p.paid_at) return false;
        const d = new Date(p.paid_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingPaymentsCount = data.payments.filter((p) => p.payment_status === 'PENDING').length;
    const pendingPaymentsAmount = data.payments
      .filter((p) => p.payment_status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0);

    // Reviews rating
    const avgRating =
      data.reviews.length > 0
        ? Number((data.reviews.reduce((s, r) => s + r.rating, 0) / data.reviews.length).toFixed(1))
        : 5.0;

    // Service popularity breakdown
    const servicePopularity = data.services.map((srv) => {
      const count = data.appointments.filter((a) => a.service_id === srv.id).length;
      return { name: srv.name, count, price: srv.price, category: srv.category };
    }).sort((a, b) => b.count - a.count);

    // Status breakdown
    const statusCounts = {
      PENDING: data.appointments.filter((a) => a.status === 'PENDING').length,
      CONFIRMED: data.appointments.filter((a) => a.status === 'CONFIRMED').length,
      COMPLETED: data.appointments.filter((a) => a.status === 'COMPLETED').length,
      CANCELLED: data.appointments.filter((a) => a.status === 'CANCELLED').length,
      NO_SHOW: data.appointments.filter((a) => a.status === 'NO_SHOW').length,
    };

    return {
      totalAppointments,
      todayAppointments,
      upcomingAppointments,
      completedAppointments,
      totalClients,
      todayRevenue,
      monthlyRevenue,
      pendingPaymentsCount,
      pendingPaymentsAmount,
      avgRating,
      totalReviews: data.reviews.length,
      servicePopularity,
      statusCounts,
      recentReviews: data.reviews.slice(0, 5),
    };
  },

  getReceptionStats: () => {
    const data = initDatabase();
    const today = new Date().toISOString().split('T')[0];

    const todayAppointments = data.appointments.filter((a) => a.appointment_date === today);
    const upcomingAppointments = data.appointments.filter(
      (a) => a.appointment_date >= today && (a.status === 'CONFIRMED' || a.status === 'PENDING')
    ).length;
    const completedAppointments = data.appointments.filter(
      (a) => a.appointment_date === today && a.status === 'COMPLETED'
    ).length;
    const pendingPayments = data.payments.filter((p) => p.payment_status === 'PENDING').length;
    const todayCustomerCount = todayAppointments.length;

    return {
      todayAppointmentsCount: todayAppointments.length,
      upcomingAppointments,
      completedAppointments,
      pendingPayments,
      todayCustomerCount,
    };
  },
};
