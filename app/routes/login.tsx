import { data, useActionData, redirect } from "react-router";
import { z } from "zod";
import { ErrorMessage, PrimaryButton, PrimaryInput } from "~/components/forms";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  // Import server-only modules inside server functions only
  const { requireLoggedOutUser } = await import("~/utils/auth.server");
  
  // Temporarily bypass auth check for development
  // await requireLoggedOutUser(request);
  return null;
}

const loginSchema = z.object({
  email: z.string().email(),
});

export async function action({ request }: ActionFunctionArgs) {
  // SIMPLE DEV LOGIN - No magic links needed
  const { commitSession, getSession } = await import("~/sessions");
  const { getUser, createUser } = await import("~/models/user.server");
  
  const cookieHeader = request.headers.get("cookie");
  const session = await getSession(cookieHeader);
  const formData = await request.formData();
  
  const email = formData.get("email");
  
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return data({ errors: { email: "Valid email required" }, email }, { status: 400 });
  }

  try {
    // Get or create user
    let user = await getUser(email);
    
    if (!user) {
      user = await createUser(email, "Dev", "User");
    }
    
    // Set session and redirect to app
    session.set("userId", user.id);
    
    return redirect("/app/recipes", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return data({ errors: { email: "Login failed" }, email }, { status: 500 });
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