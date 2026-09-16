# Social-Vibe

A premium, full-stack Social Media Management SaaS application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **Unified Dashboard**: View metrics across all connected platforms.
- **Global Post Composer**: Draft a single post and blast it to Instagram, LinkedIn, Facebook, Pinterest, and YouTube.
- **Media Uploads**: Secure image and video uploading with local previews.
- **Scheduling Engine**: Background cron workers automatically publish your scheduled posts at the exact right time.
- **Dynamic Analytics**: View real-time engagement data on beautiful Recharts area graphs.

## Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or MongoDB Atlas)

## Local Development

### 1. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/socialvibe
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend (in development mode):
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and automatically proxy API requests to `http://localhost:5000`.

## Production Deployment (Docker)

You can easily deploy the entire stack using Docker:

```bash
docker build -t social-vibe .
docker run -p 5000:5000 -e MONGO_URI="your_production_mongo_uri" -e JWT_SECRET="your_secret" social-vibe
```

*Note: In production, you will need to update the `server/src/app.js` to serve the static Vite build (`client/dist`) from the root route (`/`), which is a standard Express setup.*
