import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      // Keep as-is if parsing fails
    }
  }

  const { to, subject, html, text } = body || {};

  if (!to || !subject) {
    return res.status(400).json({ success: false, message: 'Missing recipient or subject' });
  }

  const user = process.env.EMAIL_USER?.trim() || 'tahiram.cs.23@nitj.ac.in';
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, '') || 'lxoyduateasrtwfn';
  const rawFromName = process.env.FROM_NAME || 'GAL Acceleration Lab';
  const fromName = rawFromName.replace(/^["']|["']$/g, '').trim();

  const mailOptions = {
    from: `"${fromName}" <${user}>`,
    to: to.trim().toLowerCase(),
    subject,
    text,
    html,
  };

  // Primary: Port 465 Direct SSL
  try {
    const transporter465 = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    });

    const info = await transporter465.sendMail(mailOptions);
    console.log(`[Bridge] Email sent to ${to} via port 465. Message ID: ${info.messageId}`);
    return res.status(200).json({ success: true, messageId: info.messageId, method: 'smtp-465' });
  } catch (err465) {
    console.warn(`[Bridge] Port 465 failed (${err465.message}). Retrying port 587...`);

    // Fallback: Port 587 STARTTLS
    try {
      const transporter587 = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 8000,
      });

      const info587 = await transporter587.sendMail(mailOptions);
      console.log(`[Bridge] Email sent to ${to} via port 587. Message ID: ${info587.messageId}`);
      return res.status(200).json({ success: true, messageId: info587.messageId, method: 'smtp-587' });
    } catch (err587) {
      console.error(`[Bridge] All SMTP delivery attempts failed for ${to}:`, err587.message);
      return res.status(500).json({ success: false, error: err587.message });
    }
  }
}
