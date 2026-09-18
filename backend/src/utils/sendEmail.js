import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text }) => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, '');
  const rawFromName = process.env.FROM_NAME || 'GAL Acceleration Lab';
  const fromName = rawFromName.replace(/^["']|["']$/g, '').trim();
  const cleanTo = (to || '').trim().toLowerCase();

  if (!user || !pass) {
    console.error('❌ [sendEmail] EMAIL_USER or EMAIL_PASS is missing. Set them in Render environment variables.');
    return { error: 'Email credentials not configured' };
  }

  console.log(`📧 Sending email to: ${cleanTo} | Subject: ${subject}`);
  console.log(`📬 From: ${user}`);

  const mailOptions = {
    from: `"${fromName}" <${user}>`,
    to: cleanTo,
    subject,
    text,
    html,
  };

  // Try port 587 (STARTTLS) first — most reliable on Render
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${cleanTo} via port 587. Message ID: ${info.messageId}`);
    return { messageId: info.messageId, method: 'smtp-587' };
  } catch (err587) {
    console.warn(`⚠️ Port 587 failed (${err587.message}). Trying port 465...`);

    // Fallback: port 465 SSL
    try {
      const transporter465 = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      });

      const info465 = await transporter465.sendMail(mailOptions);
      console.log(`✅ Email sent to ${cleanTo} via port 465. Message ID: ${info465.messageId}`);
      return { messageId: info465.messageId, method: 'smtp-465' };
    } catch (err465) {
      console.error(`❌ All SMTP attempts failed for ${cleanTo}:`, err465.message);
      return { error: err465.message };
    }
  }
};
