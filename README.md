
# **🗺️ Let's Explore: Find the Hidden Gems!**

Welcome to **Treasure Hunt**, an exciting, gamified web app designed to take scavenger hunts to the next level! With puzzles, real-time geolocation challenges, and a thrilling leaderboard, this platform transforms treasure hunts into a modern, immersive experience.

---

## **📖 About the Project**

Are you ready to embark on a quest? Our treasure hunt platform combines problem-solving, teamwork, and a bit of outdoor exploration for an adrenaline-fueled adventure! Players solve riddles, unlock hints, and pinpoint locations on the map—all while competing to claim the top spot on the leaderboard.

This project was developed to enhance event engagement for universities, organizations, or just for fun among friends. By leveraging real-time geolocation and a visually stunning interface, we bring excitement and competition to a whole new level.

---

## **👥 Team Members**

This project wouldn’t have been possible without the efforts of our dynamic team:
- **Vatsal Kumar** – Project Lead & Backend Developer
- **Manpreet Kaur** – Frontend Wizard
- **Shourya Mishra** – Frontend Dev 

Together, we brought this treasure hunt to life!

---

## Installation/Set-up 🚀

Follow these steps to set up the project on your local machine:

### Prerequisites
- **Node.js** (v16+ recommended)
- **MongoDB** (local or cloud setup)
- **Redis** (local or cloud setup)
- **Git**
- **Cloudinary Account** (for image storage)
- Google API Credentials (for OAuth)

### Clone the Repository
Clone the project repository from GitHub:
```bash
git clone <repository-url>
```

### Setting up the Backend
1. Switch to the backend branch:
   ```bash
   git checkout main
   ```
2. Navigate to the `main` folder:
   ```bash
   cd Let-s-Explore
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file:
   - Use the sample `.env` template provided and configure it with your details.
5. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on the port defined in the `.env` file (default: `5217`).

### Setting up the Frontend
1. Switch to the frontend branch:
   ```bash
   git checkout frontend
   ```
2. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Update the `.env` file if needed (e.g., `NEXT_PUBLIC_API_URL` to match your backend server URL).
5. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000` by default.

### Verify the Application
- Open your browser and navigate to `http://localhost:3000` to interact with the application.
- Ensure the backend server is running in a separate terminal.

### Additional Notes
- Ensure MongoDB and Redis are running on your system or use cloud-based services for both.
- Check the logs for any issues and update the `.env` file accordingly.

---

# Server Configuration
PORT=3000
CORS_ORIGIN=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/my_database

# Redis Configuration
REDIS_URL=redis://default:your_redis_password@redis-12345.c123.region.gce.cloud.com:12345

# JWT Secrets and Expiry
ACCESS_TOKEN_SECRET=YourAccessTokenSecret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=YourRefreshTokenSecret
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary Configuration
CLOUDINARY_API_KEY=YourCloudinaryAPIKey
CLOUDINARY_API_SECRET=YourCloudinaryAPISecret
CLOUDINARY_CLOUD_NAME=YourCloudinaryCloudName

# Google OAuth Credentials
GOOGLE_CLIENT_ID=YourGoogleClientId
GOOGLE_CLIENT_SECRET=YourGoogleClientSecret

   ```

5. **Run the app**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

6. **Start exploring the treasures!**

---

## **🌟 Features**

1. **🧩 Puzzle Challenges**
   - Solve brain-teasing riddles and answer creative clues.
   - Submit your guesses to unlock new puzzles.

2. **📍 Real-Time Geolocation**
   - Pinpoint target locations on the map with precision.
   - Validate your guesses with Haversine distance calculations.

3. **🎯 Leaderboard**
   - See how you stack up against other participants.
   - Points are awarded for each puzzle based on time and accuracy.

4. **🔐 Hint System**
   - Unlock hints using points if you’re stuck.
   - Limited hints keep the game challenging!

5. **📷 Photo Uploads**
   - Add photo submissions to verify your treasure hunt progress.

6. **✨ Responsive Design**
   - Optimized for mobile, tablet, and desktop.

---

## **📸 Screenshots**

### **Logo**
The Minimilist Logo that symbolizes the purpose of this website:  
![Logo](https://github.com/user-attachments/assets/38100775-ec69-4633-8ec8-918024c426f8)

### **Homepage**
The sleek and inviting landing page:  
![Homepage](https://github.com/user-attachments/assets/e358f506-c000-4a4f-9789-8f07b2515232)

### **Puzzle Interface**
Engage with fun puzzles and solve them with your team:  
![Puzzle Interface](https://github.com/user-attachments/assets/1edf39fc-b192-49ef-99ef-0e931778b95e)

### **Real-Time Geolocation**
Pinpoint your guess and submit for validation:  
![Map View](https://github.com/user-attachments/assets/a2ec15b3-7082-420d-82db-188512139b5e)

### **Leaderboard**
Compete and climb to the top:  
![Leaderboard](https://github.com/user-attachments/assets/91111130-221f-4875-add9-0e1dd571cf4b)

---

## **💡 Why This Project Stands Out**

- **Innovation**: Combines modern web tech with classic treasure hunt fun.
- **Engagement**: Keeps users hooked with competitive and interactive features.
- **Scalability**: Can handle large groups with ease—ideal for events and festivals.

---

## **🚀 Let the Hunt Begin!**

Thank you for checking out **Let's Explore**! Whether you’re solving puzzles, exploring the map, or climbing the leaderboard, we hope this project brings you joy and adventure.

Feel free to fork the repo, submit PRs, or share feedback. Let’s make treasure hunting unforgettable!

---

> *"The greatest treasures are not gold and jewels, but the memories we make along the way."*

---

Crafted with ❤️ by Team SilentSynatx!

