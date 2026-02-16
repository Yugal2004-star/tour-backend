const express = require("express");
const cors = require("cors");
require("dotenv").config();

const enquiryRoutes = require("./routes/enquiry.routes");
const contactRoutes = require("./routes/contact.routes");

const app = express();

/* ======================================================
   ✅ CORS CONFIGURATION (Netlify + Localhost)
====================================================== */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://indiatourcmp.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow Postman / server-to-server
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS not allowed"), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

/* ======================================================
   ✅ REQUEST LOGGER
====================================================== */
app.use((req, res, next) => {
  console.log(`📍 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/* ======================================================
   ✅ HEALTH CHECK ROUTE
====================================================== */
app.get("/api/health", (req, res) => {
  const envCheck = {
    BREVO_API_KEY: process.env.BREVO_API_KEY ? "✅ Configured" : "❌ Not configured",
    BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL ? "✅ Configured" : "❌ Not configured",
    RECEIVER_EMAIL: process.env.RECEIVER_EMAIL ? "✅ Configured" : "❌ Not configured",
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "production",
  };

  console.log("🏥 Health check requested:", envCheck);

  res.status(200).json({
    success: true,
    message: "Server running successfully 🚀",
    timestamp: new Date().toISOString(),
    environment: envCheck,
  });
});

/* ======================================================
   ✅ ROOT ROUTE
====================================================== */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "India Tour Company API 🌍",
    status: "Running ✅",
    version: "3.0.0",
    endpoints: [
      "POST /api/enquiry",
      "POST /api/contact",
      "GET /api/health",
    ],
  });
});

/* ======================================================
   ✅ API ROUTES
====================================================== */
app.use("/api", enquiryRoutes);
app.use("/api", contactRoutes);

/* ======================================================
   ✅ 404 HANDLER
====================================================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

/* ======================================================
   ✅ GLOBAL ERROR HANDLER
====================================================== */
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
});

/* ======================================================
   ✅ START SERVER (Render Compatible)
====================================================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "production"}`);
  console.log(`📧 Email service: Brevo API (HTTPS)`);
  console.log(`📬 Receiver email: ${process.env.RECEIVER_EMAIL || "Not set"}`);
  console.log("=".repeat(50));
});

/* ======================================================
   ✅ GRACEFUL SHUTDOWN
====================================================== */
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("👋 SIGINT received. Shutting down...");
  process.exit(0);
});
