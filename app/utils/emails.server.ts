import { Resend } from 'resend';

// Check if Resend is configured
const isResendConfigured = typeof process.env.RESEND_API_KEY === "string" && process.env.RESEND_API_KEY !== "dummy-key";

// Initialize Resend client
let resend: Resend | null = null;
if (isResendConfigured) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

type Message = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(message: Message) {
  if (!isResendConfigured || !resend) {
    console.log("Resend not configured - would send:", message.subject, "to", message.to);
    return Promise.resolve({ id: "mock-email-id", message: "Email service not configured" });
  }
  
  try {
    const result = await resend.emails.send({
      from: message.from,
      to: message.to,
      subject: message.subject,
      html: message.html,
    });
    
    console.log("Email sent successfully:", result.id);
    return result;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}