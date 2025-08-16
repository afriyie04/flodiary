// This file is not currently used - authentication is handled via apiService and AuthContext

export async function login(email, password) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to login");
  }

  const data = await response.json();
  console.log("Login response: ", data);
  
  // Token storage is handled by apiService
  return data;
}

export async function register(formData) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to register");
  }

  const data = await response.json();
  console.log("Register response: ", data);
  
  // Token storage is handled by apiService
  return data;
}

export async function logout() {
  // Logout is handled by apiService and AuthContext
  console.log("Logout called");
}
