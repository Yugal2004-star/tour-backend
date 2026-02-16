const transporter = require("../utils/mailer");

exports.sendContactMail = async (req, res) => {
  console.log("🔥 Contact API HIT");
  console.log("📨 Request body:", req.body);

  try {
    const {
      name,
      phone,
      email,
      startDate,
      days,
      adults,
      children,
      category,
      tourName,
      message,
    } = req.body;

    // ✅ Basic validation
    if (!name || !phone || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing (name, phone, email, message)",
      });
    }

    const mailOptions = {
      from: `"Website Contact" <${process.env.BREVO_SENDER_EMAIL}>`, // Must be verified in Brevo
      to: process.env.RECEIVER_EMAIL,
      replyTo: email, // User's email for easy reply
      subject: `📩 New Contact Enquiry from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #912082, #db2777); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .section { margin-bottom: 20px; padding: 15px; background: white; border-radius: 5px; }
            .label { font-weight: bold; color: #912082; }
            .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; }
            .message-box { background: #fff9e6; padding: 15px; border-left: 4px solid #912082; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">📩 New Contact Form Enquiry</h1>
            </div>
            
            <div class="content">
              <div class="section">
                <h2 style="color: #912082; margin-top: 0;">Contact Information</h2>
                <p><span class="label">Name:</span> ${name}</p>
                <p><span class="label">Phone:</span> <a href="tel:${phone}">${phone}</a></p>
                <p><span class="label">Email:</span> <a href="mailto:${email}">${email}</a></p>
              </div>

              ${category || tourName ? `
              <div class="section">
                <h2 style="color: #912082; margin-top: 0;">Tour Preferences</h2>
                ${category ? `<p><span class="label">Category:</span> ${category}</p>` : ''}
                ${tourName ? `<p><span class="label">Tour Name:</span> ${tourName}</p>` : ''}
                ${startDate ? `<p><span class="label">Start Date:</span> ${startDate}</p>` : ''}
                ${days ? `<p><span class="label">Number of Days:</span> ${days}</p>` : ''}
                ${adults ? `<p><span class="label">Adults:</span> ${adults}</p>` : ''}
                ${children ? `<p><span class="label">Children:</span> ${children}</p>` : ''}
              </div>
              ` : ''}

              <div class="section">
                <h2 style="color: #912082; margin-top: 0;">Message</h2>
                <div class="message-box">
                  <p style="white-space: pre-wrap; margin: 0;">${message}</p>
                </div>
              </div>
            </div>

            <div class="footer">
              <p>This message was submitted from your website contact form on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
              <p style="color: #912082;">India Tour Company</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log("📤 Sending contact email to:", process.env.RECEIVER_EMAIL);

    // ✅ Send email with timeout
    const info = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout')), 30000)
      )
    ]);

    console.log("✅ Contact email sent successfully:", info.messageId);

    res.status(200).json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
      messageId: info.messageId
    });

  } catch (error) {
    console.error("❌ Contact mail error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command
    });
    
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again or contact us directly.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};