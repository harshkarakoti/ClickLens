# ClickLens - Analytics & Traffic Engine

## 🚀 Project Overview
ClickLens is a high-performance URL redirection service that doubles as a traffic analytics platform. Unlike standard shorteners, ClickLens focuses on the "Data Platform" aspect, capturing granular user metadata for every request before redirection.

## 🛠 Tech Stack
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas (Aggregation Framework)
- **Analytics:** Custom Middleware for User-Agent parsing

## 🏗 Architecture (In Progress)
1. **Link Service:** Generates unique, short-ID tokens for long URLs.
2. **Analytics Middleware:** Intercepts incoming requests to log IP, Browser, OS, and Timestamp data asynchronously.
3. **Aggregation Engine:** Uses MongoDB Aggregation pipelines to calculate "Clicks per Region" and "Browser Distribution" in real-time.

## 🔄 Current Status
- [x] Database Schema Design
- [ ] API Development (In Progress)
- [ ] Aggregation Query Optimization
