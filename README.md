# ChitChat App

A real-time messaging application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO.

## 🚀 Features

-   **Real-time Messaging**: Instant chat using Socket.IO.
-   **User Authentication**: Secure JWT-based auth.
-   **Responsive Design**: Built with Tailwind CSS for mobile and desktop.
-   **Online Status**: See who is currently online.

## 🛠️ Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS, Axios, Zustand (or Context API).
-   **Backend**: Node.js, Express.js, Socket.IO.
-   **Database**: MongoDB (Mongoose).
-   **Authentication**: JSON Web Tokens (JWT).

## 📂 Project Structure

This project follows a **Monorepo** structure:

-   `client/`: Contains the Frontend React application.
-   `backend/`: Contains the Backend Node.js/Express API.

## ⚙️ Getting Started

### Prerequisites

-   Node.js (v18 or higher recommended)
-   MongoDB (Local or Atlas URL)

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    -   Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    -   Fill in your details (MongoDB URI, JWT Secret, Cloudinary credentials).
4.  Start the server:
    ```bash
    npm start
    ```
    The server typically runs on `http://localhost:5000`.

### 2. Frontend Setup

1.  Navigate to the client directory:
    ```bash
    cd ../client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    -   Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    -   Update `VITE_BACKEND_URL` to point to your backend (e.g., `http://localhost:5000`).
4.  Start the development server:
    ```bash
    npm run dev
    ```
    The app will run on `http://localhost:5173`.

## 📦 Deployment

### Frontend (Netlify / Vercel)
Deploy the `client` folder. Set the Build Command to `npm run build` and Output Directory to `dist`.
**Env Var**: `VITE_BACKEND_URL` (Your production backend URL).

### Backend (Render / Railway)
Deploy the `backend` folder.
**Env Vars**: `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_...`, `PORT`.
*Note: Vercel serverless functions are not recommended for the backend due to Socket.IO requirements.*
