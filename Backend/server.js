import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import mealRouter from "./routes/mealRoute.js";
import authMiddleware from "./middleware/auth.js";
import MongoStore from 'connect-mongo'; 
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import {
  fetchUserProfile,
  fetchUserProfileByRollNumber,
} from "./controllers/userController.js";
import "./controllers/mealController.js"; // Ensure the cron job runs
import hostelRouter from "./routes/hostelRoute.js";
import noticeRouter from "./routes/noticeRoute.js";
import reportRouter from "./routes/reportRoute.js";
import wastageRouter from "./routes/wastageRoute.js"; // Import the wastage routes
import menuRouter from "./routes/menuRoute.js"; // Import the wastage routes
import bookingRouter from "./routes/bookingRoute.js";
import adminRouter from "./routes/adminRoute.js";

const app = express();
const url = "http://localhost:4000" || process.env.DB_URL; //backendURL
const port = process.env.PORT || 4000;
const corsOptions = {
  origin: [
    "https://testing-pe3pkcc5e-pardume-sharmas-projects.vercel.app",
    "https://admin-umess.onrender.com",
    "https://testing-nine-ecru.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const sessionOptions = {
  secret: "hduwhfuwheuhjshujfhweuihfjshcnsjknkanrein", // Use a secret key for encryption
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL || "mongodb://localhost:27017/umess", // your MongoDB connection string
    collectionName: "sessions", // The collection to store session data
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // Session will expire after 1 day
    httpOnly: true, // helps prevent cross-site scripting (XSS)
    secure: process.env.NODE_ENV === "production", // Only send the cookie over HTTPS in production
    sameSite: "strict", // Protects against cross-site request forgery (CSRF)
  },
};

app.use(session(sessionOptions));
app.use(cors(corsOptions));
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'UMESS API Documentation',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/review", reviewRouter);
app.use("/api/hostel", hostelRouter);
app.use("/api/meal", mealRouter);
app.use("/api/notice", noticeRouter);
app.get("/api/profileByRollNumber/:rollNumber", fetchUserProfileByRollNumber);
app.use("/api/reports", reportRouter);
app.use("/api/wastage", wastageRouter);
app.use("/api/menu", menuRouter);
app.get("/api/profileByRollNumber/:rollNumber", fetchUserProfileByRollNumber);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>UMESS API</title></head>
      <body style="font-family: Arial; padding: 50px; text-align: center;">
        <h1>🍽️ UMESS API is Running</h1>
        <p>University Mess Management System API</p>
        <a href="/api-docs" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
          📚 View API Documentation
        </a>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
