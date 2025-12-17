# 🚀 ClickLens - Analytics & Traffic Engine

Live Demo: https://click-lens.vercel.app/

## 🎯 Project Overview

ClickLens is a high-performance URL redirection service that acts as a Data Platform. Unlike standard URL shorteners, ClickLens focuses on the "Infrastructure" aspect of data collection, capturing granular user metadata (IP, User-Agent, Device Type) asynchronously for every request.

The system relies on Data Engineering principles, separating high-velocity write operations (logging) from read-heavy operations (analytics) to ensure scalability.

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Frontend**: HTML5, Tailwind CSS (Dark Mode UI)
- **Deployment**: Vercel (Serverless Functions)
- **Key Libraries**: shortid, express-useragent, mongoose

## 🏗 System Architecture

### Link Generation Service
Generates unique, collision-resistant short tokens optimized for O(1) read access.

### Redirection Engine
Detects incoming traffic and redirects immediately while asynchronously writing metadata to the logs collection (Non-blocking I/O).

### Analytics Pipeline
Uses MongoDB Aggregation Framework ($match, $group, $sum) to process raw logs into actionable insights (e.g., Browser Distribution) in real-time.

## ✅ Current Status

- [x] Dynamic URL Shortening: Automatically detects host (Localhost vs Vercel)
- [x] Smart Redirection: Captures OS, Device, and Browser data instantly
- [x] Real-Time Analytics: Visual dashboard showing total clicks and browser breakdown
- [x] Full-Stack UI: Dark-mode interface built with Tailwind CSS
- [x] Secure Deployment: Environment variables managed via Vercel Secrets

## 🚀 How to Run Locally

### Clone the repository

```bash
git clone https://github.com/harshkarakotiofficial/ClickLens.git
cd ClickLens
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create a `.env` file in the root directory:

```
MONGO_URI=your_mongodb_connection_string
PORT=3001
```

### Start the Server

```bash
node index.js
```

The dashboard will be available at `http://localhost:3001`

## 📂 Database Schema

### 1. Url Schema (Read-Heavy)

Optimized for fast lookups during redirection.

```json
{
  "shortId": "String (Indexed, Unique)",
  "redirectUrl": "String"
}
```

### 2. Log Schema (Write-Heavy)

Stores the raw click-stream data for analytics.

```json
{
  "shortId": "String",
  "timestamp": "Date",
  "browser": "String",
  "os": "String",
  "device": "String",
  "ipAddress": "String"
}
```

---

Built for the MongoDB Software Engineering Internship Application (Data Engineering Dept).