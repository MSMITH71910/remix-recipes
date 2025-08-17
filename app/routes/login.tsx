import { data, useActionData, redirect } from "react-router";
import { z } from "zod";
import { ErrorMessage, PrimaryButton, PrimaryInput } from "~/components/forms";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  // Import server-only modules inside server functions only
  const { requireLoggedOutUser } = await import("~/utils/auth.server");
  
  // Redirect logged-in users to the app
  await requireLoggedOutUser(request);
  return null;
}

const loginSchema = z.object({
  email: z.string().email(),
});

export async function action({ request }: ActionFunctionArgs) {
  const { commitSession, getSession } = await import("~/sessions");
  const { generateMagicLink, sendMagicLinkEmail } = await import("~/magic-links.server");
  const { v4: uuid } = await import("uuid");
  
  const cookieHeader = request.headers.get("cookie");
  const session = await getSession(cookieHeader);
  const formData = await request.formData();
  
  const email = formData.get("email");
  
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return data({ errors: { email: "Valid email required" }, email }, { status: 400 });
  }

  try {
    // Generate nonce for security
    const nonce = uuid();
    session.set("nonce", nonce);
    
    // Generate and send magic link
    const magicLink = await generateMagicLink(email, nonce);
    await sendMagicLinkEmail(magicLink, email);
    
    // In development, show the magic link
    const isDev = process.env.NODE_ENV === "development";
    
    return data(
      { 
        success: "Check your email for a magic link to sign in!", 
        email,
        developmentNote: isDev ? `Dev mode: Click this link to sign in: ${magicLink}` : undefined
      },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  } catch (error) {
    console.error("Magic link error:", error);
    return data({ errors: { email: "Failed to send magic link. Please try again." }, email }, { status: 400 });
  }
}

export default function Login() {
  const actionData = useActionData<any>();
  return (
    <div className="text-center mt-36">
      {actionData?.success ? (
        <div>
          <h1 className="text-2xl py-8">Yum!</h1>
          <p className="mb-4">
            Check your email and follow the instructions to finish logging in.
          </p>
          {actionData?.developmentNote && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded-md mt-4">
              <p className="font-semibold">Development Mode:</p>
              <p>{actionData.developmentNote}</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h1 className="text-3xl mb-8">Remix Recipes</h1>
          <form method="post" className="mx-auto md:w-1/3">
            <div className="text-left pb-4">
              <PrimaryInput
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="off"
                defaultValue={actionData?.email}
              />
              <ErrorMessage>{actionData?.errors?.email}</ErrorMessage>
            </div>
            <PrimaryButton className="w-1/3 mx-auto">Log In</PrimaryButton>
          </form>
        </div>
      )}
    </div>
  );
}