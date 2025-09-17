import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from './routes/adminRoute.js'
import vendorRoute from './routes/venderRoute.js'
import cors from 'cors'
import cookieParser from "cookie-parser";
import { cloudinaryConfig } from "./utils/cloudinaryConfig.js";


const App = express();

// Configurar CORS PRIMERO
const allowedOrigins = ['http://localhost:5173'];
App.use(
  cors({
    origin: allowedOrigins,
    methods:['GET', 'PUT', 'POST' ,'PATCH','DELETE'],
    credentials: true,
  })
);

// Middleware básicos
App.use(express.json());
App.use(cookieParser());

// Configurar dotenv
dotenv.config();
const port = process.env.PORT || 5000;

// Conectar a MongoDB
mongoose
  .connect(process.env.mongo_uri)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// Configurar Cloudinary solo para rutas que lo necesiten
App.use('/api/admin/*', cloudinaryConfig);
App.use('/api/vendor/*', cloudinaryConfig);

// Definir rutas
App.use("/api/user", userRoute);
App.use("/api/auth", authRoute);
App.use("/api/admin", adminRoute);
App.use("/api/vendor", vendorRoute);

// Middleware de manejo de errores
App.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Iniciar servidor
App.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
  console.log(`🌐 Backend URL: http://localhost:${port}`);
  console.log(`📱 Frontend should connect to: http://localhost:5173`);
});
