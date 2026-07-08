# 🎯 InterviewIQ

InterviewIQ is an AI-powered mock interview platform that helps users prepare for technical interviews through AI-generated questions, secure authentication, and real-time interview sessions. The platform provides an interactive interview experience with personalized questions and feedback.

---

## 🚀 Features

- 🤖 AI-powered interview question generation using OpenRouter AI
- 🔐 Secure user authentication with Firebase
- 👤 User registration and login
- 💳 Razorpay payment integration
- 📋 Personalized mock interview sessions
- 🗄️ MongoDB database for storing users and interview data
- 🔒 JWT-based authentication and authorization
- 📱 Responsive user interface

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- Firebase Authentication

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- OpenRouter AI API
- Razorpay

### Tools

- Git & GitHub
- Postman
- MongoDB Compass
- VS Code

---

## 📂 Folder Structure

```
3.interviewIQ
│
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Environment Variables

### Client (`client/.env`)

```env
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Server (`server/.env`)

```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## 💻 Installation

### Clone the repository

```bash
git clone https://github.com/Nkb31/interviewIQ.git
```

### Install dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

---

## ▶️ Running the Project

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

Visit:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

---

## 🌟 Future Improvements

- Voice-based AI interviews
- Video interview support
- AI performance scoring
- Resume analysis
- Coding interview editor
- Interview analytics dashboard

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Nishanta Bhuyan**

- GitHub: https://github.com/Nkb31
- LinkedIn: https://www.linkedin.com/in/nishanta-bhuyan-54aa35308
