import nodemailer from 'nodemailer';

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

  try {
    // Port 465 with SSL is significantly more reliable across cloud hosting platforms like Render
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 7000,
      greetingTimeout: 7000,
      socketTimeout: 7000,
    });

    const fromAddress = `"${process.env.FROM_NAME || 'GAL Acceleration Lab'}" <${user}>`;

    const mailOptions = {
      from: fromAddress,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️  Real Email successfully delivered to: ${to} (Message ID: ${info.messageId})`);
    return { messageId: info.messageId };
  } catch (error) {
    console.warn(`⚠️  Email delivery warning for ${to}:`, error.message);
    return { error: error.message };
  }
};
