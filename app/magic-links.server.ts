import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import db from "~/db.server";
import { sendEmail } from "~/utils/emails.server";

export async function generateMagicLink(email: string) {
  const token = uuid();
  const hashedToken = await bcrypt.hash(token, 10);
  
  // Store the hashed token in database with expiration
  // This is a simplified implementation - you'd want to create a proper table
  // for magic links with expiration times
  
  return `${process.env.BASE_URL}/validate-magic-link?token=${token}&email=${encodeURIComponent(email)}`;
}

export async function sendMagicLinkEmail(magicLink: string, email: string) {
  const emailHtml = `
    <h1>Sign in to Remix Recipes</h1>
    <p>Click the link below to sign in:</p>
    <a href="${magicLink}">Sign In</a>
    <p>If you didn't request this, you can safely ignore this email.</p>
  `;
  
  await sendEmail({
    from: process.env.MAILGUN_FROM_EMAIL || "noreply@example.com",
    to: email,
    subject: "Your Remix Recipes Magic Link",
    html: emailHtml,
  });
}

export async function getMagicLinkPayload(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");
  
  if (!token || !email) {
    throw new Error("Invalid magic link");
  }
  
  // This is a simplified implementation
  // In a real app, you'd verify the token against the database
  return { 
    email, 
    valid: true, 
    createdAt: new Date().toISOString(), 
    nonce: "dummy-nonce" // In real app, this would be stored with the token
  };
}

export async function invalidMagicLink(token: string) {
  // Remove the token from database
  // Simplified implementation
  return true;
}