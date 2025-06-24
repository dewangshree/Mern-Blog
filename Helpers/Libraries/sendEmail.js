const nodemailer = require('nodemailer');

const sendEmail = async (mailOptions) => {
  try {
    const { SMTP_HOST, SMTP_PORT, EMAIL_USERNAME, EMAIL_PASS } = process.env;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Accept self-signed certs (optional)
      },
    });

    const info = await transporter.sendMail({
      from: `"MERN Blog Support" <${EMAIL_USERNAME}>`,
      ...mailOptions,
    });

    console.log(`📧 Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Email failed to send:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
