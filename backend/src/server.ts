import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import session from "express-session";
import { ConnectSessionKnexStore } from "connect-session-knex";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

import authRoutes from "./routes/auth";
import celebrationRoutes from "./routes/celebrations";
import wishRoutes from "./routes/wishes";
import db from "./db";

const env = process.env.NODE_ENV || "development";
const isProduction = env === "production";

if (isProduction) {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
} else {
  dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1);

const corsOptions: cors.CorsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
console.log("Frontend URL:", frontendUrl);
console.log("Environment:", env);

app.use(cors(corsOptions));
app.use(express.json());

const sessionStore = new ConnectSessionKnexStore({
  knex: db,
  tableName: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "weesha_session_secret_2024",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

app.use("/api/auth", authRoutes);
app.use("/api/celebrations", celebrationRoutes);
app.use("/api/wishes", wishRoutes);

app.post("/api/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const stream = cloudinary.uploader.upload_stream({ folder: "weesha" }, (error, result) => {
      if (error || !result) {
        return res.status(500).json({ error: "Upload failed" });
      }
      res.json({ imageUrl: result.secure_url });
    });

    const readable = new Readable();
    readable.push(req.file.buffer);
    readable.push(null);
    readable.pipe(stream);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Weesha API server running on port ${PORT}`);
});

export default app;
