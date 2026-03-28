# 🎬 Movie Rental System – Frontend

A modern, production-ready movie rental web application built with React, TypeScript, Redux Toolkit, and RTK Query. The platform allows customers to rent movies, vendors to manage inventory, and admins to monitor analytics and users.

This frontend integrates with a Django REST API backend.

---

## 🚀 Features

### 👤 Authentication & Authorization
- JWT authentication
- Role-based access control (Admin, Vendor, Customer)
- Secure login and logout
- Protected routes

### 🎥 Movies
- Browse movies with pagination
- Search movies by title
- Filter movies by genre
- View detailed movie information
- Real-time availability status

### 📦 Inventory Management (Vendor)
- View inventory per movie
- Update available copies
- Update total copies
- Prevent renting when stock is zero

### 🛒 Rentals (Customer)
- Rent movies
- View rental status
- Real-time stock validation

### 🧑‍💼 Admin Dashboard
- View total users, rentals, and revenue
- View top rented movies
- Manage users and roles
- Monitor platform activity

### 📊 Analytics
- Total revenue
- Active rentals
- Total customers
- Top performing movies

---

## 🛠 Tech Stack

**Frontend**
- React
- TypeScript
- Redux Toolkit
- RTK Query
- React Router
- Tailwind CSS
- ShadCN UI

**API Integration**
- Django REST Framework backend
- JWT Authentication

---

## 📁 Project Structure
src/
├── components/
│ ├── MovieCard.tsx
│ ├── Navbar.tsx
│
├── pages/
│ ├── HomePage.tsx
│ ├── MovieDetailPage.tsx
│ ├── AdminPage.tsx
│
├── store/
│ ├── api/
│ │ ├── movieApi.ts
│ │ ├── rentalApi.ts
│ │ ├── inventoryApi.ts
│ │ ├── userApi.ts
│ │
│ ├── slices/
│ │ ├── authSlice.ts
│ │ ├── uiSlice.ts
│
├── lib/
│ ├── types.ts



---

## ⚡ Installation

```bash
git clone https://github.com/Ifeanyisunday/Movie-Management-System-SASS--frontend.git

cd movie-rental-frontend

npm install

npm run dev


# Key Architecture Decisions

RTK Query for efficient API caching

Role-based UI rendering

Scalable folder structure

Fully typed TypeScript interfaces

Reusable UI components


# Future Improvements

Payment integration

Movie images upload

Vendor-specific analytics

Notifications

Dark mode screens