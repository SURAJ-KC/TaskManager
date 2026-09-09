const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // ⚡ FIX: Force IPv4 to prevent Render ENETUNREACH errors
  family: 4,
  connectionTimeout: 10000, // 10 seconds timeout
  greetingTimeout: 5000,
  socketTimeout: 10000,
  tls: {
    rejectUnauthorized: false, // Prevents self-signed cert issues on cloud platforms
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"Auth System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${to}`);
    return info;
  } catch (error) {
    console.error('❌ Gmail Transporter Error:', error);
    throw new Error(error.message || 'Failed to send email via Gmail');
  }
};

module.exports = sendEmail;