import { data, redirect, useLoaderData, useActionData, Form, useSubmit, useNavigation } from "react-router";
import { themeCookie } from "~/cookies";
import type { Route } from "./+types/settings";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("action");
  
  if (action === "updateProfile") {
    // Get current user
    const { requireLoggedInUser } = await import("~/utils/auth.server");
    const user = await requireLoggedInUser(request);
    
    // Handle profile update
    const email = formData.get("email");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    
    // Validate input
    if (!email || !firstName || !lastName) {
      return data({ error: "All fields are required" }, { status: 400 });
    }
    
    // Update user in database
    const { updateUser } = await import("~/models/user.server");
    await updateUser(user.id, {
      email: email.toString(),
      firstName: firstName.toString(),
      lastName: lastName.toString(),
    });
    
    // Show success message
    return data({ success: "Profile updated successfully!" });
  } else {
    // Handle theme change
    const theme = formData.get("theme");
    
    return redirect("/settings", {
      headers: {
        "Set-Cookie": await themeCookie.serialize(theme),
      },
    });
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const { requireLoggedInUser } = await import("~/utils/auth.server");
  const user = await requireLoggedInUser(request);
  
  const cookieHeader = request.headers.get("cookie");
  const theme = await themeCookie.parse(cookieHeader) || "green";
  
  return { theme, user };
}

export default function Settings() {
  const { theme, user } = useLoaderData<typeof loader>();
  const actionData = useActionData<any>();
  const submit = useSubmit();
  const navigation = useNavigation();
  
  const themes = [
    { value: "green", label: "Green", color: "#00743e" },
    { value: "red", label: "Red", color: "#f22524" },
    { value: "orange", label: "Orange", color: "#ff4b00" },
    { value: "yellow", label: "Yellow", color: "#cc9800" },
    { value: "blue", label: "Blue", color: "#01a3e1" },
    { value: "purple", label: "Purple", color: "#5325c0" },
  ];

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Settings</h1>
        
        <div className="space-y-8">
          {/* Theme Settings */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">App Theme</h2>
            <p className="text-gray-600 mb-6">Choose your preferred color theme</p>
            
            <Form method="post" className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {themes.map((themeOption) => (
                <label
                  key={themeOption.value}
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    theme === themeOption.value ? 'border-primary bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={themeOption.value}
                    defaultChecked={theme === themeOption.value}
                    onChange={(e) => {
                      // Submit the form and force page reload to show new theme
                      const formData = new FormData();
                      formData.set('theme', themeOption.value);
                      
                      submit(formData, { method: 'post' });
                      
                      // Force full page reload after a delay to ensure CSS is updated
                      setTimeout(() => {
                        window.location.reload();
                      }, 500);
                    }}
                    className="sr-only"
                  />
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: themeOption.color }}
                  />
                  <span className="font-medium text-gray-900">{themeOption.label}</span>
                  {theme === themeOption.value && (
                    <div className="ml-auto">
                      <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </label>
              ))}
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Save Theme
                </button>
              </div>
            </Form>
          </div>

          {/* Account Settings */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Account Settings</h2>
            
            {/* Success/Error Messages */}
            {actionData?.success && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                {actionData.success}
              </div>
            )}
            {actionData?.error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {actionData.error}
              </div>
            )}
            
            <Form method="post" className="space-y-4">
              <input type="hidden" name="action" value="updateProfile" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email"
                  defaultValue={user.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email address"
                />
                <p className="text-sm text-gray-500 mt-1">Your primary email address</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input 
                    type="text" 
                    name="firstName"
                    defaultValue={user.firstName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input 
                    type="text" 
                    name="lastName"
                    defaultValue={user.lastName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Save Account Settings
                </button>
              </div>
            </Form>
          </div>

          {/* App Preferences */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">App Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive email updates about your recipes</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Public Profile</h3>
                  <p className="text-sm text-gray-500">Allow others to see your recipes</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-red-600">Danger Zone</h2>
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-red-900">Delete Account</h3>
                  <p className="text-sm text-red-600">Permanently remove your account and all data</p>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}