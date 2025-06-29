# 🚆 Train Search Web Application

Live Demo: [https://v0-train-search-application.vercel.app/](https://v0-train-search-application.vercel.app/)

## 📌 Overview

This is a scalable Train Search Web Application that allows users to:
- Select **source** and **destination** stations from dropdowns
- View a list of available trains on that route
- Sort trains based on **price** or **timing**
- See dynamic ticket pricing based on distance (₹1.25/km)
- Get **chained route suggestions** if no direct trains are available
- Receive appropriate feedback when no route is available

---

## ✨ Features

- 🚉 Real-time search from a large set of generated train data (1000+ trains)
- 📍 Dropdown selection for source and destination
- 💵 Pricing calculated by distance at ₹1.25/km
- 🔁 Intelligent multi-train chaining if no direct route is available
- 🔄 Sorting support: by **price** or **departure time**
- 📱 Fully responsive and user-friendly UI
- ⚙️ Scalable backend with RESTful APIs

---

## 🛠️ Tech Stack

### Frontend:
- React.js
- Tailwind CSS
- Vite (or Create React App)
- Axios for API calls

### Backend:
- Node.js
- Express.js

### Database:
- Neon DataBase

---

## 🧪 Test Data Generation

- A custom script is included to populate the database with **1000 trains** and their corresponding station routes using realistic data.
- The script ensures coverage of:
  - Direct routes
  - Chained connections
  - Edge cases (no route available)

