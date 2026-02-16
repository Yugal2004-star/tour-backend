const express = require("express");
const cors = require("cors");
require("dotenv").config();

const enquiryRoutes = require("./routes/enquiry.routes");
const contactRoutes = require("./routes/contact.routes");

const app = express();

// ✅ CORS Configuration - Allow your Netlify frontend
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://indiatourcmp.netlify.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Request logging middleware
app.use((req, res, next) => {
  console.log(`📍 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ✅ Health check endpoint
app.get('/api/health', (req, res) => {
  const envCheck = {
    BREVO_SMTP_USER: process.env.BREVO_SMTP_USER ? '✅ Configured' : '❌ Not configured',
    BREVO_SMTP_PASSWORD: process.env.BREVO_SMTP_PASSWORD ? '✅ Configured' : '❌ Not configured',
    BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL ? '✅ Configured' : '❌ Not configured',
    RECEIVER_EMAIL: process.env.RECEIVER_EMAIL ? '✅ Configured' : '❌ Not configured',
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'production'
  };

  console.log('🏥 Health check requested:', envCheck);

  res.json({ 
    success: true, 
    message: 'Server is running perfectly! 🚀',
    timestamp: new Date().toISOString(),
    environment: envCheck
  });
});

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'India Tour Company API 🌍',
    status: 'Running ✅',
    version: '2.0.0',
    endpoints: [
      'POST /api/enquiry - Submit tour enquiry',
      'POST /api/contact - Submit contact form',
      'GET /api/health - Health check'
    ]
  });
});

// ✅ API Routes
app.use("/api", enquiryRoutes);
app.use("/api", contactRoutes);

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'POST /api/enquiry',
      'POST /api/contact',
      'GET /api/health'
    ]
  });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:', err);
  console.error('Stack trace:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? {
      message: err.message,
      stack: err.stack
    } : 'An error occurred'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📧 Email service: Brevo SMTP`);
  console.log(`📬 Receiver email: ${process.env.RECEIVER_EMAIL || 'Not set'}`);
  console.log('='.repeat(50));
});

// ✅ Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});







