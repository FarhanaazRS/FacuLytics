# FacuLytics - Faculty Analytics & Review System

A full-stack web application for students to review and compare faculty members in the SCORE department at VIT.

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

## 📦 Tech Stack

- **Frontend**: React + Vite, React Router, Recharts, TailwindCSS
- **Backend**: Node.js + Express
- **Future**: MongoDB integration, Python ML for sentiment analysis

## 🎯 Features

### Current (MVP)
- ✅ View all faculties with ratings
- ✅ Detailed faculty pages with reviews
- ✅ Add reviews with 4 parameters (Teaching, Marks, Quiz, Communication)
- ✅ Compare multiple faculties visually
- ✅ Responsive design

### Planned
- 🔄 MongoDB integration
- 🔄 User authentication
- 🔄 Sentiment analysis on comments
- 🔄 Advanced analytics dashboard

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/faculties` | List all faculties |
| GET | `/api/faculty/:id` | Faculty details + reviews |
| POST | `/api/faculty` | Add new faculty |
| POST | `/api/review` | Submit review |
| GET | `/api/compare?ids=1,2` | Compare faculties |

## 🗂️ Project Structure

```
faculytics/
├── backend/
│   ├── server.js          # Main Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/         # React pages
│   │   ├── App.jsx        # Main app with routing
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🧪 Testing

1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:5173
4. Test adding reviews and comparing faculties

## 📝 Next Steps

1. Add MongoDB models and connection
2. Create authentication system
3. Build analytics dashboard
4. Integrate Python sentiment analysis
5. Deploy to production

## 👥 Contributors

SCORE Department Students @ VIT
