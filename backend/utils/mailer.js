const nodemailer = require('nodemailer');

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  return transporter;
};

const sendNotificationEmail = async ({ to, subject, message, html }) => {
  if (!to) return false;

  const mailer = getTransporter();
  if (!mailer) {
    console.warn('Mail skipped: MAIL_USER or MAIL_PASS is not configured');
    return false;
  }

  try {
    await mailer.sendMail({
      from: `"UrbanPulse" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text: message,
      html: html || `<p>${message}</p>`,
    });
    return true;
  } catch (error) {
    console.error('Failed to send notification email:', error.message);
    return false;
  }
};

module.exports = { sendNotificationEmail };
