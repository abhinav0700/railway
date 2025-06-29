# 🚆 Train Search Web Application

Live Demo: [https://v0-train-search-application.vercel.app/](https://v0-train-search-application.vercel.app/)

## 📌 Overview

This is a scalable Train Search Web Application that allows users to:
- Select *source* and *destination* stations from dropdowns
- View a list of available trains on that route
- Sort trains based on *price* or *timing*
- See dynamic ticket pricing based on distance (₹1.25/km)
- Get *chained route suggestions* if no direct trains are available
- Receive appropriate feedback when no route is available
- ✅ Now includes an *"Add Train"* feature for inserting new train routes

---

## ✨ Features

- 🚉 Real-time search of trains between selected stations
- 📍 Dropdown selection for source and destination
- 💵 Ticket pricing based on distance (₹1.25 per km)
- 🔄 Sorting by *price* or *departure time*
- ➕ Admins can now *add new trains* and station-wise route data
- 🔁 Multi-train route support if direct train is not available
- ❌ Shows "No trains available" if no path exists
- 📱 Fully responsive and user-friendly UI

---

## 🛠 Tech Stack

### Frontend:
- React.js
- Tailwind CSS
- Vite
- Axios for API calls

### Backend:
- Node.js
- Express.js

### Database:
- *Neon (Serverless PostgreSQL)*
- Connected via pg module using SSL

---

## 🧪 Test Data Generation

- A custom script is included to populate the database with **1000 trains** and their corresponding station routes using realistic data.
- The script ensures coverage of:
  - Direct routes
  - Chained connections
  - Edge cases (no route available)

## Developers
<details>
  <summary><span style="font-size: 18px">Abhinav M</span></summary>

  
  [GitHub](https://github.com/abhinav0700)

  [LinkedIn](https://www.linkedin.com/in/abhinav070/)

</details>

<details>
  <summary><span style="font-size: 18px">Z Mohammed Ghayaz</span></summary>

  [GitHub](https://github.com/Mohammed-Ghayaz)

  [LinkedIn](https://www.linkedin.com/in/mohammed-ghayaz/)
</details>

