import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text }) => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, '');

  const hasRealSmtp = Boolean(
    user &&
    pass &&
    !user.includes('your_email')
  );

  let transporter;

  if (hasRealSmtp) {
    // Verified Google / Gmail SMTP transporter
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
  } else {
    // Fallback development test transporter
    console.log('ℹ️  No external SMTP configured in .env. Creating test email transporter...');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

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

  return {
    messageId: info.messageId,
  };
};
