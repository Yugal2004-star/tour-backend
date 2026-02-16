const transporter = require("../utils/mailer");

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

    // ✅ Validation
    if (!name || !phone || !email || !tourName) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing (name, phone, email, tourName)",
      });
    }

    // ✅ Email configuration
    const mailOptions = {
      from: `"Tour Enquiry System" <${process.env.BREVO_SENDER_EMAIL}>`, // Must be verified in Brevo
      to: process.env.RECEIVER_EMAIL,
      replyTo: email, // User's email for easy reply
      subject: `🌍 New Tour Enquiry - ${tourName}`,
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">🌍 New Tour Enquiry</h1>
            </div>
            
            <div class="content">
              <div class="section">
                <h2 style="color: #912082; margin-top: 0;">Tour Details</h2>
                <p><span class="label">Tour Name:</span> ${tourName}</p>
                <p><span class="label">Tour ID:</span> ${tourId || 'N/A'}</p>
              </div>

              <div class="section">
                <h2 style="color: #912082; margin-top: 0;">Customer Information</h2>
                <p><span class="label">Name:</span> ${name}</p>
                <p><span class="label">Phone:</span> <a href="tel:${phone}">${phone}</a></p>
                <p><span class="label">Email:</span> <a href="mailto:${email}">${email}</a></p>
              </div>

              <div class="section">
                <h2 style="color: #912082; margin-top: 0;">Travel Details</h2>
                <p><span class="label">Start Date:</span> ${startDate || 'Not specified'}</p>
                <p><span class="label">Duration:</span> ${numberOfDays || 'N/A'} days</p>
                <p><span class="label">Number of Adults:</span> ${numberOfAdults || '0'}</p>
                <p><span class="label">Number of Children:</span> ${numberOfChildren || '0'}</p>
                <p><span class="label">Total Travelers:</span> ${(parseInt(numberOfAdults || 0) + parseInt(numberOfChildren || 0))}</p>
              </div>

              ${query ? `
              <div class="section">
                <h2 style="color: #912082; margin-top: 0;">Additional Query</h2>
                <p style="white-space: pre-wrap;">${query}</p>
              </div>
              ` : ''}
            </div>

            <div class="footer">
              <p>This enquiry was submitted from your website on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
              <p style="color: #912082;">India Tour Company</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log("📤 Sending email to:", process.env.RECEIVER_EMAIL);
    
    // ✅ Send email with timeout
    const info = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout')), 30000)
      )
    ]);

    console.log("✅ Email sent successfully:", info.messageId);

    res.status(200).json({ 
      success: true, 
      message: "Enquiry sent successfully! We'll contact you soon.",
      messageId: info.messageId 
    });

  } catch (error) {
    console.error("❌ Enquiry mail error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command
    });
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to send enquiry. Please try again or contact us directly.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};