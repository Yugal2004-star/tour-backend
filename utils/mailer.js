const nodemailer = require("nodemailer");

// ✅ PRODUCTION-READY: Using Brevo (formerly SendinBlue) - Works on Render
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.BREVO_SMTP_USER, // Your Brevo SMTP login
    pass: process.env.BREVO_SMTP_PASSWORD, // Your Brevo SMTP password
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ✅ Test connection on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

module.exports = transporter;
