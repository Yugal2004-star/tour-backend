const axios = require("axios");

exports.sendEnquiryMail = async (req, res) => {
  console.log("🔥 Enquiry API HIT");
  console.log("📨 Request body:", req.body);

  try {
    const {
      tourName,
      tourId,
      name,
      phone,
      email,
      startDate,
      numberOfDays,
      numberOfAdults,
      numberOfChildren,
      query,
    } = req.body;

    if (!name || !phone || !email || !tourName) {
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
        subject: `🌍 New Tour Enquiry - ${tourName}`,
        htmlContent: `
          <h2>New Tour Enquiry</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Tour:</b> ${tourName}</p>
          <p><b>Start Date:</b> ${startDate || "N/A"}</p>
          <p><b>Days:</b> ${numberOfDays || "N/A"}</p>
          <p><b>Adults:</b> ${numberOfAdults || 0}</p>
          <p><b>Children:</b> ${numberOfChildren || 0}</p>
          <p><b>Message:</b> ${query || "None"}</p>
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
      message: "Enquiry sent successfully!",
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
