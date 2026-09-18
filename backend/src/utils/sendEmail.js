import nodemailer from 'nodemailer';

let pooledTransporter = null;

function getTransporter() {
  const user = process.env.EMAIL_USER?.trim() || 'tahiram.cs.23@nitj.ac.in';
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, '') || 'lxoyduateasrtwfn';

  if (!pooledTransporter) {
    pooledTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 14,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  return { transporter: pooledTransporter, user };
}

export const sendEmail = async ({ to, subject, html, text }) => {
  const user = process.env.EMAIL_USER?.trim() || 'tahiram.cs.23@nitj.ac.in';
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, '') || 'lxoyduateasrtwfn';

  const hasRealSmtp = Boolean(
    user &&
    pass &&
    !user.includes('your_email') &&
    pass.length >= 8
  );

  if (!hasRealSmtp) {
    console.log(`ℹ️  [Dev Mode / No SMTP] Email simulated for: ${to}`);
    return { messageId: 'dev-mode-simulated' };
  }

  const rawFromName = process.env.FROM_NAME || 'GAL Acceleration Lab';
  const fromName = rawFromName.replace(/^["']|["']$/g, '').trim();
  const fromAddress = `"${fromName}" <${user}>`;

  const mailOptions = {
    from: fromAddress,
    to: to.trim().toLowerCase(),
    subject,
    text,
    html,
  };

  try {
    const { transporter } = getTransporter();
    console.log(`🚀 Dispatching email to: ${to} - "${subject}"`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️  Real Email successfully delivered to: ${to} (Message ID: ${info.messageId})`);
    return { messageId: info.messageId };
  } catch (err1) {
    console.warn(`⚠️  Primary pool delivery attempt failed for ${to} (${err1.message}). Retrying directly...`);
    pooledTransporter = null; // reset pool on error

    try {
      const directTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 8000,
      });

      const fallbackInfo = await directTransporter.sendMail(mailOptions);
      console.log(`✉️  Real Email delivered via fallback to: ${to} (Message ID: ${fallbackInfo.messageId})`);
      return { messageId: fallbackInfo.messageId };
    } catch (err2) {
      console.error(`❌ Real Email delivery error for ${to}:`, err2.message);
      return { error: err2.message };
    }
  }
};
