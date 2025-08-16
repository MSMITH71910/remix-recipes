import { createCookieSessionStorage } from "react-router";

console.log("AUTH_COOKIE_SECRET type:", typeof process.env.AUTH_COOKIE_SECRET);
console.log("AUTH_COOKIE_SECRET value:", process.env.AUTH_COOKIE_SECRET ? "[REDACTED]" : "undefined");
console.log("All env keys containing AUTH:", Object.keys(process.env).filter(key => key.includes("AUTH")));

if (typeof process.env.AUTH_COOKIE_SECRET !== "string") {
  throw new Error(`Missing env: AUTH_COOKIE_SECRET (type: ${typeof process.env.AUTH_COOKIE_SECRET}, value: ${process.env.AUTH_COOKIE_SECRET})`);
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "remix-recipes__session",
      secrets: [process.env.AUTH_COOKIE_SECRET],
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  });

export { getSession, commitSession, destroySession };