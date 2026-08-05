# 💇‍♀️ Salon Management System

A modern, full-stack web application designed to streamline salon operations. This system handles customer appointment bookings, staff schedules, service management, and salon inventory.

## 🚀 Key Features

* **Smart Appointment Booking:** Customers can easily view available services and book appointments based on time slots.
* **Service Management:** Admins can add, update, and manage salon services dynamically.
* **Inventory Tracking:** Built-in stock management system with low-stock alerts for salon products.
* **Automated Notifications:** 1-hour prior SMS reminders for both customers and staff.

## 💻 Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Backend:** Next.js API Routes
* **Database:** PostgreSQL (via Supabase)
* **Authentication:** Supabase Auth

## 🛠️ Getting Started

1. Clone the repository
2. Install dependencies using `npm install`
3. Create a `.env` file and add your Supabase URL and Anon Key:
   `NEXT_PUBLIC_SUPABASE_URL=your_url`
   `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key`
4. Run the development server using `npm run dev`