import formData from "form-data";
import Mailgun from "mailgun.js";

// Check if email service is configured
const isEmailConfigured = 
  typeof process.env.MAILGUN_API_KEY === "string" && 
  typeof process.env.MAILGUN_DOMAIN === "string";

// Only initialize mailgun if configured
let client: any = null;
if (isEmailConfigured) {
  const mailgun = new Mailgun(formData);
  client = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
  });
}

type Message = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export function sendEmail(message: Message) {
  if (!isEmailConfigured) {
    console.log("Email not configured - would send:", message.subject, "to", message.to);
    return Promise.resolve({ id: "mock-email-id", message: "Email service not configured" });
  }
  
  return client.messages.create(process.env.MAILGUN_DOMAIN, message);
}