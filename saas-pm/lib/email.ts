import nodemailer from "nodemailer";

const smtpOptions = {
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "test_user",
    pass: process.env.SMTP_PASS || "test_pass",
  },
};

export const transporter = nodemailer.createTransport(smtpOptions);

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"SAAS PM" <no-reply@saas-pm.com>',
      to,
      subject,
      text,
      html,
    });

    console.log(`Message sent: ${info.messageId}`);

    // Preview only available when sending through an Ethereal account
    if (process.env.SMTP_HOST?.includes("ethereal")) {
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
