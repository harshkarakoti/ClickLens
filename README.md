ClickLens - Analytics & Traffic Engine 🚀

Live Demo: https://click-lens.vercel.app/

📖 Project Overview

ClickLens is a high-performance URL redirection service that acts as a Data Platform. Unlike standard URL shorteners, ClickLens focuses on the "Infrastructure" aspect of data collection, capturing granular user metadata (IP, User-Agent, Device Type) asynchronously for every request.

The system is designed to separate high-velocity write operations (logging clicks) from read-heavy operations (analytics dashboard) using MongoDB.

🛠 Tech Stack

Backend: Node.js, Express.js

Database: MongoDB Atlas (Mongoose ODM)

Frontend: HTML5, Tailwind CSS (Dark Mode UI)

Deployment: Vercel (Serverless Functions)

Key Libraries: shortid, express-useragent, mongoose

🏗 System Architecture

Link Generation Service: Generates unique, collision-resistant short tokens.

Redirection Engine:

Detects incoming traffic.

Async Logging: Redirects the user immediately while asynchronously writing metadata to the logs collection to minimize latency.

Analytics Pipeline:

Uses MongoDB Aggregation Framework ($match, $group, $sum) to process raw logs into actionable insights (e.g., Browser Distribution) in real-time.

✅ Completed Features

[x] Dynamic URL Shortening: Automatically detects host (Localhost vs Vercel).

[x] Real-Time Analytics: Visual dashboard showing total clicks and browser breakdown.

[x] Smart Redirection: Captures OS, Device, and Browser data before redirecting.

[x] Full-Stack Dashboard: Clean, responsive UI built with Tailwind CSS.

[x] Secure Deployment: Environment variables managed via Vercel Secrets.

🚀 How to Run Locally

Clone the repository

git clone [https://github.com/harshkarakotiofficial/ClickLens.git](https://github.com/harshkarakotiofficial/ClickLens.git)
cd ClickLens



Install Dependencies

npm install



Configure Environment
Create a .env file in the root directory:

MONGO_URI=your_mongodb_connection_string
PORT=3001



Start the Server

node index.js



Visit http://localhost:3001 in your browser.

📂 Database Schema

1. Url Schema (Optimized for Reads)

{
  "shortId": "String (Indexed, Unique)",
  "redirectUrl": "String"
}



2. Log Schema (Optimized for Writes)

{
  "shortId": "String",
  "timestamp": "Date",
  "browser": "String",
  "os": "String",
  "device": "String"
}



Built for the MongoDB Software Engineering Internship Application (Data Engineering Dept).
