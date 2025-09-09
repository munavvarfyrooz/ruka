import * as nodemailer from "nodemailer";

// Create reusable transporter
// Using Zoho SMTP configuration
const createTransporter = () => {
  // Check if email credentials are configured
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");

  if (!emailUser || !emailPass) {
    console.warn("Email credentials not configured. Email notifications will be disabled.");
    console.warn("Set EMAIL_USER and EMAIL_PASS environment variables to enable email notifications.");
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  });
};

export async function sendEmailNotification(
  subject: string,
  content: string,
  toEmail: string = "hi@ruka.live"
) {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log("Email notification skipped - email service not configured");
      return false;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@ruka.live",
      to: toEmail,
      subject: subject,
      html: content,
      text: content.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email notification sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send email notification:", error);
    return false;
  }
}

export function formatEmailSubscriptionNotification(email: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">New Email Subscription</h2>
      <p>A new user has subscribed to Ruka updates:</p>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 10px 0 0 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <p style="color: #6b7280; font-size: 14px;">
        This notification was sent from the Ruka AI Agent Landing Page.
      </p>
    </div>
  `;
  return html;
}

export function formatCallRequestNotification(
  name: string,
  phoneNumber: string,
  email?: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">New Call Request</h2>
      <p>A new user has requested a call from Ruka:</p>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 10px 0 0 0;"><strong>Phone:</strong> ${phoneNumber}</p>
        ${email ? `<p style="margin: 10px 0 0 0;"><strong>Email:</strong> ${email}</p>` : ""}
        <p style="margin: 10px 0 0 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <p style="color: #10b981; font-weight: bold;">
        ✅ Ruka AI will automatically call this lead.
      </p>
      <p style="color: #6b7280; font-size: 14px;">
        This notification was sent from the Ruka AI Agent Landing Page.
      </p>
    </div>
  `;
  return html;
}