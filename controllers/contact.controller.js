const axios = require("axios");

exports.sendContactMail = async (req, res) => {
  console.log("🔥 Contact API HIT");
  console.log("📨 Request body:", req.body);

  try {
    const {
      name,
      phone,
      email,
      message,
      category,
      tourName,
      startDate,
      days,
      adults,
      children,
    } = req.body;

    if (!name || !phone || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "India Tour Company",
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [
          {
            email: process.env.RECEIVER_EMAIL,
          },
        ],
        subject: `📩 New Contact from ${name}`,
        htmlContent: `
          <h2>New Contact Form Submission</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Message:</b> ${message}</p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
      data: response.data,
    });

  } catch (error) {
    console.error("❌ Brevo API error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Email service temporarily unavailable",
    });
  }
};
