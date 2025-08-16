const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth token
  getAuthToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("flodiary-token");
    }
    return null;
  }

  // Helper method to set auth token
  setAuthToken(token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("flodiary-token", token);
      // Also set as cookie for middleware
      document.cookie = `flodiary-token=${token}; path=/; max-age=2592000; samesite=lax`;
    }
  }

  // Helper method to remove auth token
  removeAuthToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("flodiary-token");
      // Also remove cookie
      document.cookie = "flodiary-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  // Helper method to make API requests
  async request(endpoint, options = {}) {
    const token = this.getAuthToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log("API Request:", this.baseURL + endpoint);
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle different error status codes
        switch (response.status) {
          case 401:
            // Unauthorized - remove token and redirect to login
            this.removeAuthToken();
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            throw new Error("Session expired. Please log in again.");
          case 403:
            throw new Error("Access denied. You don't have permission to access this resource.");
          case 404:
            throw new Error("The requested resource was not found.");
          case 429:
            throw new Error("Too many requests. Please try again later.");
          case 500:
            throw new Error("Server error. Please try again later.");
          default:
            throw new Error(
              errorData.message || `Request failed with status ${response.status}`
            );
        }
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      
      // Handle network errors
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Network error. Please check your internet connection.");
      }
      
      throw error;
    }
  }

  // Authentication endpoints
  async signup(userData) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  // User management endpoints
  async getProfile() {
    return this.request("/users/profile");
  }

  async updateProfile(profileData) {
    return this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    return this.request("/users/password", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    });
  }

  // Cycle tracking endpoints
  async addCycle(cycleData) {
    return this.request("/cycles", {
      method: "POST",
      body: JSON.stringify(cycleData),
    });
  }

  async getCycles(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/cycles?${queryString}` : "/cycles";
    return this.request(endpoint);
  }

  async getCycle(id) {
    return this.request(`/cycles/${id}`);
  }

  async updateCycle(id, cycleData) {
    return this.request(`/cycles/${id}`, {
      method: "PUT",
      body: JSON.stringify(cycleData),
    });
  }

  async deleteCycle(id) {
    return this.request(`/cycles/${id}`, {
      method: "DELETE",
    });
  }

  async getCycleStats() {
    try {
      // Try to get stats from backend first
      return await this.request("/cycles/stats");
    } catch (error) {
      console.warn("Failed to get stats from backend, calculating locally:", error);
      
      // Fallback to calculating stats locally using prediction engine
      try {
        const cyclesResponse = await this.getCycles();
        const cycles = cyclesResponse.cycles || [];
        
        const { default: LinearRegressionPredictor } = await import("./predictions");
        return LinearRegressionPredictor.calculateStats(cycles);
      } catch (fallbackError) {
        console.error("Failed to calculate stats locally:", fallbackError);
        throw error; // Re-throw original error
      }
    }
  }

  // Prediction endpoints - using frontend prediction engine
  async predictCycle(cycles) {
    // Import the prediction engine dynamically to avoid server-side issues
    const { default: LinearRegressionPredictor } = await import("./predictions");
    
    // Generate prediction using frontend engine
    const prediction = LinearRegressionPredictor.predict(cycles);
    
    // If prediction is successful, save it to backend for persistence
    if (prediction.nextPeriod && !prediction.error) {
      try {
        await this.request("/prediction/predict", {
          method: "POST",
          body: JSON.stringify({
            nextPeriod: prediction.nextPeriod,
            model: prediction.model
          }),
        });
      } catch (error) {
        console.warn("Failed to save prediction to backend:", error);
        // Don't fail the prediction if backend save fails
      }
    }
    
    return prediction;
  }

  async getPredictionHealth() {
    return this.request("/prediction/health");
  }

  async getModelInfo() {
    return this.request("/prediction/model-info");
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
