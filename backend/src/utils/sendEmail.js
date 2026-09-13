import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text }) => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, '');

  const hasRealSmtp = Boolean(
    user &&
    pass &&
    !user.includes('your_email') &&
    pass.length >= 8
  );

  if (!hasRealSmtp) {
    console.log(`ℹ️  [Dev Mode / No SMTP] Email would be sent to: ${to}`);
    console.log(`ℹ️  Subject: ${subject}`);
    return { messageId: 'dev-mode-simulated' };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });

    const fromAddress = `"${process.env.FROM_NAME || 'GAL Acceleration Lab'}" <${user || 'no-reply@gal.com'}>`;

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
