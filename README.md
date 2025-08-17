# 🏢 Institute Manager

A web application for educational institutes to manage members and send automated WhatsApp subscription reminders.

## 🚨 Important: WhatsApp Setup Required

**To receive WhatsApp reminders, you must join the Twilio Sandbox:**
1. Send **`join bear-death`** to **+1 415 523 8886** from your WhatsApp
2. You'll receive a confirmation message
3. Now you can receive reminders from the application

*This step is required because the app uses Twilio Sandbox for WhatsApp integration.*

## 🌐 Live Demo

**Frontend:** [https://member-manager-client.vercel.app](https://member-manager-client.vercel.app)  
**Backend API:** [https://institute-manager-tan.vercel.app](https://institute-manager-tan.vercel.app)

## ✨ Key Features

- **🔐 JWT Authentication** - Secure staff login/registration
- **👥 Member Management** - Add, view, search, and filter members
- **📱 WhatsApp Reminders** - Automated reminders for subscriptions expiring within 3 days
- **📊 Dashboard** - Analytics and quick overview of member statistics
- **📱 Mobile Responsive** - Works perfectly on all devices

## 🛠️ Tech Stack

**Frontend:** React + Vite + Tailwind CSS  
**Backend:** Node.js + Express + MongoDB  
**Authentication:** JWT  
**WhatsApp:** Twilio API  

## 🚀 Quick Setup

### 1. Clone & Install
```bash
git clone https://github.com/shivangi-jain-08/training-institute.git
cd institute-manager

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### 2. Environment Variables

**Backend `.env`:**
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-minimum-32-characters
PORT=5000
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+14155238886
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173`

## 📱 Testing WhatsApp

1. **Join Sandbox:** Send `join bear-death` to `+1 415 523 8886`
2. **Add Test Member:** Use your WhatsApp number as contact
3. **Set Expiry Date:** Within next 3 days
4. **Send Reminder:** Click the Chat icon in member list

## 🏗️ Project Structure

```
institute-manager/
├── backend/
│   ├── models/        # User & Member schemas
│   ├── routes/        # API endpoints
│   ├── controllers/   # Business logic
│   ├── services/      # WhatsApp integration
│   └── server.js      # Main server
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── context/     # Auth state
    │   └── services/    # API calls
    └── public/
```

---

**Contact:** myselfshivangi08@gmail.com 
