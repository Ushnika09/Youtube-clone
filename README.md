# 🎬 **YouTube Clone - MERN Video Streaming Platform**

## 📋 **Overview**  
This project is a full-stack **YouTube Clone** built with the **MERN stack**.  
It lets users explore and watch videos without login, while authenticated users can create channels, upload videos, edit or delete them, and play videos in a modern, responsive UI.  

The backend integrates with **RapidAPI** to fetch and **seed trending videos** into the database, so the homepage always stays fresh with discoverable content.  

---

## ✨ **Features**

- **Guest Access**  
  - Browse & search videos freely  
  - Play videos directly from homepage  

- **Authentication (JWT-based)**  
  - Secure login & signup  
  - Protected routes for managing videos and channels  

- **Channel Management**  
  - Create & customize channel (banner, avatar, description)  
  - Dashboard view of all your uploaded videos  

- **Video Management**  
  - Upload videos with title, description, thumbnail  
  - Edit video details anytime  
  - Delete videos from your channel  
  - Playback with views, timestamps, and metadata  

- **RapidAPI Integration**  
  - Fetch trending videos  
  - Seed into database for homepage discovery  

- **Responsive Design**  
  - Mobile-first design  
  - Optimized layouts for desktop, tablet, and mobile  

---

## 🛠️ **Tech Stack**  
- **Frontend:** React.js, Tailwind CSS, React Router, Context API  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas  
- **Authentication:** JWT (JSON Web Token)  
- **API Integration:** RapidAPI  
- **Deployment:** Netlify (Frontend), Render (Backend)  

---

## 🚀 **Live Demo**   
- **Backend API:** Hosted on Render  
- **Source Code:** [GitHub Repository](https://github.com/Ushnika09/YouTube-Clone.git)  

---

## 🚀 **Installation & Setup (Windows)**

### **Prerequisites**  
- Node.js (v16 or higher) → [Download here](https://nodejs.org/)  
- Git for Windows → [Download here](https://git-scm.com/)  
- MongoDB Atlas account → [Setup here](https://www.mongodb.com/cloud/atlas)  
- Code Editor (VS Code recommended)  

---

### 1. **Clone the Repository**
```bash
git clone https://github.com/Ushnika09/YouTube-Clone.git
cd YouTube-Clone
```
### 2. Backend Setup
```bash
cd backend
npm install
```
### Start Backend Server
```bash
npm start
```
### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
### Start Development Server
```bash
npm run dev
```

##📁 Project Structure
```bash
YouTube-Clone/
├── backend/        # Express.js + MongoDB + JWT + RapidAPI
├── frontend/       # React.js + Tailwind + Context API
└── README.md
```
