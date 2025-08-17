import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import db from "~/db.server";
import { sendEmail } from "~/utils/emails.server";

// Store magic links in memory for development (in production, use database)
const magicLinks = new Map<string, { 
  email: string; 
  nonce: string; 
  createdAt: string; 
  hashedToken: string; 
}>();

export async function generateMagicLink(email: string, nonce: string) {
  const token = uuid();
  const hashedToken = await bcrypt.hash(token, 10);
  const createdAt = new Date().toISOString();
  
  // Store the magic link data
  magicLinks.set(token, {
    email,
    nonce,
    createdAt,
    hashedToken
  });
  
  const baseUrl = process.env.BASE_URL || "https://remix-recipes.onrender.com";
  return `${baseUrl}/validate-magic-link?token=${token}&email=${encodeURIComponent(email)}`;
}

export async function sendMagicLinkEmail(magicLink: string, email: string) {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #F97316; text-align: center;">🍴 Remix Recipes</h1>
      <h2>Sign in to your account</h2>
      <p>Click the button below to securely sign in to Remix Recipes:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${magicLink}" 
           style="background-color: #F97316; color: white; padding: 15px 30px; 
                  text-decoration: none; border-radius: 8px; display: inline-block;
                  font-weight: bold;">
          🔐 Sign In to Remix Recipes
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">
        This link will expire in 10 minutes for security.<br>
        If you didn't request this, you can safely ignore this email.
      </p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #999; font-size: 12px; text-align: center;">
        Remix Recipes - Passwordless Authentication
      </p>
    </div>
  `;
  
  await sendEmail({
    from: process.env.MAILGUN_FROM_EMAIL || "noreply@example.com",
    to: email,
    subject: "🔐 Sign in to Remix Recipes",
    html: emailHtml,
  });
}

export async function getMagicLinkPayload(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");
  
  if (!token || !email) {
    throw new Error("Invalid magic link - missing token or email");
  }
  
  // Get the stored magic link data
  const linkData = magicLinks.get(token);
  
  if (!linkData) {
    throw new Error("Invalid or expired magic link");
  }
  
  if (linkData.email !== email) {
    throw new Error("Magic link email mismatch");
  }
  
  return {
    email: linkData.email,
    nonce: linkData.nonce,
    createdAt: linkData.createdAt,
    valid: true
  };
}

export async function invalidMagicLink(token: string) {
  // Remove the token from database
  // Simplified implementation
  return true;
}