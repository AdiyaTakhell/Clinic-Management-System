
````markdown
# 🏥 MediCare CMS — Clinic Management System (MERN Stack)

**MediCare CMS** is a modern, full-stack Clinic Management System designed to simplify day-to-day clinic operations. It streamlines patient registration, live queue management, billing, and medical record tracking while maintaining a clean, low-cognitive-load user experience.

The application is built with the **MERN stack** and features the custom **“Pulse” Design System** — a teal-and-slate visual language optimized for clarity, speed, and trust in medical environments.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [API Overview](#-api-endpoints-overview)
- [Design System (Pulse)](#-design-system-pulse)
- [Printing System](#-printing-system)
- [Creating Staff Users](#-creating-staff-users-required)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Key Features

### 🏥 Receptionist Dashboard
- **Patient Registration:** Fast entry for new and returning patients
- **Smart Search:** Lookup by patient name or phone number
- **Live Queue Management:** Waiting, In-Progress, and Completed states
- **Token Generation:** Automatic token assignment per doctor
- **Doctor Availability:** Real-time doctor status
- **Daily Overview:** Patient count, live queue, and daily revenue

---

### 👨‍⚕️ Doctor Dashboard
- **Live Queue View:** See assigned patients in real time
- **Digital Prescriptions:** Add diagnosis, medicines, dosage, and notes
- **Medical History:** View complete patient visit timeline
- **Vitals Recording:** BP, weight, temperature, etc.
- **Prescription Printing:** Professional printable Rx format

---

### 💳 Billing & Invoicing
- **One-Click Billing:** Generate invoices from completed appointments
- **Payment Tracking:** Cash, Card, and UPI
- **Thermal / A4 Printing:** Browser-based printing via `react-to-print`
- **Revenue Tracking:** Daily billing overview

---

### 📂 Patient Records
- **Medical Timeline:** Chronological vertical history view
- **Past Prescriptions:** Easily accessible visit records
- **Fast Lookup:** By Patient ID or Name

---

### 🔐 Security & UX
- **Role-Based Access Control:** Doctor & Receptionist roles
- **JWT Authentication**
- **Responsive Design:** Desktop, Tablet, Mobile
- **Interactive Feedback:** Toasts, loaders, and error states

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**
- **Tailwind CSS** (Custom *Pulse* Theme)
- **TanStack Query (React Query)**
- **React Router DOM**
- **Lucide React (Icons)**
- **React Hot Toast**
- **React-to-Print**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **JWT Authentication**

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- npm or yarn
- MongoDB (local or Atlas)

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/medicare-cms.git
cd medicare-cms
````

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `/server`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Start the backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside `/client`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 📂 Project Structure

```bash
src/
├── api/
│   └── axios.js            # Axios instance with interceptors
├── components/
│   ├── Layout.jsx          # Sidebar & main layout
│   ├── InvoiceReceipt.jsx  # Printable invoice
│   ├── Login.jsx
│   └── ...
├── pages/
│   ├── ReceptionistDashboard.jsx
│   ├── DoctorDashboard.jsx
│   ├── PatientHistory.jsx
│   └── ...
├── context/
│   └── AuthContext.jsx     # Auth & role handling
└── main.jsx                # App entry point
```

---

## 📡 API Endpoints Overview

| Method | Endpoint              | Description               |
| ------ | --------------------- | ------------------------- |
| POST   | `/auth/login`         | User authentication       |
| POST   | `/users`              | Create staff user         |
| GET    | `/users/doctors`      | Fetch doctors             |
| GET    | `/appointments/today` | Today’s live queue        |
| POST   | `/appointments`       | Register appointment      |
| POST   | `/patients`           | Register patient          |
| POST   | `/invoices`           | Generate & mark bill paid |

---

## 🎨 Design System (Pulse)

The **Pulse Design System** ensures consistency and medical-grade clarity:

* **Primary:** `Teal-600` (`#0D9488`) — Actions & confirmations
* **Background:** `Slate-50` (`#F8FAFC`) — Reduced eye strain
* **Surface:** `White` (`#FFFFFF`) — Cards & modals
* **Text:**

  * Headings: `Slate-900`
  * Secondary: `Slate-500`

---

## 🖨️ Printing System

This app uses a **frontend-only print architecture**:

1. Hidden React components (`PrintInvoice`, `PrintPrescription`)
2. Data injected on action completion
3. Browser print dialog triggered
4. Users choose **Save as PDF** or **Thermal Printer**

✔ No backend PDF generation
✔ Works on all modern browsers

---

## 👨‍💻 Creating Staff Users (Required)

⚠️ **There is no Admin UI yet.**
Doctors and Receptionists must be created using **Postman**.

### Create a Doctor

**POST** `http://localhost:5000/api/users`

```json
{
  "name": "Dr. John Smith",
  "email": "doctor@clinic.com",
  "password": "123",
  "role": "Doctor",
  "specialization": "Cardiologist"
}
```

---

### Create a Receptionist

```json
{
  "name": "Sarah Jones",
  "email": "reception@clinic.com",
  "password": "123",
  "role": "Receptionist"
}
```

Once created, log in via the frontend.

---

## 🔮 Future Enhancements

* Admin Dashboard (UI-based staff management)
* Appointment Scheduling (Calendar View)
* Laboratory Management (Upload reports)
* Patient Portal (Self-service access)
* Inventory & Medicine Stock Management

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**.
See `LICENSE` for more information.

```


