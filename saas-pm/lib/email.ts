import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

async function getTransporter() {
  let smtpOptions: any = {
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "test_user",
      pass: process.env.SMTP_PASS || "test_pass",
    },
  };

  // Try to fetch from DB
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { key: "SMTP_SETTINGS" },
    });

    if (config) {
      const settings = JSON.parse(config.value);
      smtpOptions = {
        host: settings.host,
        port: parseInt(settings.port),
        secure: settings.secure || false,
        auth: {
          user: settings.user,
          pass: settings.pass,
        },
      };
    }
  } catch (e) {
    console.error("Failed to load SMTP settings from DB, falling back to ENV", e);
  }

  return nodemailer.createTransport(smtpOptions);
}

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
    const transporter = await getTransporter();

    // Determine sender
    let from = process.env.SMTP_FROM || '"SAAS PM" <no-reply@saas-pm.com>';
    try {
        const config = await prisma.systemConfig.findUnique({ where: { key: "SMTP_SETTINGS" } });
        if (config) {
            const settings = JSON.parse(config.value);
            if (settings.from) from = settings.from;
        }
    } catch {}

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log(`Message sent: ${info.messageId}`);

    // Preview only available when sending through an Ethereal account
    // This logic is simplified; in a real app check the host
    if (transporter.transporter.name === 'SMTP' && (transporter.options as any).host?.includes("ethereal")) {
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info as any)}`);
    }

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
