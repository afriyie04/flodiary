import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

// const sampleUser = {
//   cycleDetails: {
//     avgCycleLength: 28,
//     avgPeriodDuration: 5,
//     lastPeriodDate: "2025-07-01T00:00:00.000Z",
//   },
//   _id: "688b7927f91be207f5839465",
//   firstName: "Alice",
//   lastName: "Johnson",
//   username: "alicej",
//   email: "alice@example.com",
//   dailyEntries: [
//     {
//       _id: "688b820c1916591828ce7669",
//       date: "2025-07-10T00:00:00.000Z",
//       mood: "good",
//       flowLevel: "light",
//       symptoms: ["cramps", "fatigue"],
//       notes: "Felt a bit tired but manageable.",
//     },
//     {
//       _id: "688b820c1916591828ce766a",
//       date: "2025-07-11T00:00:00.000Z",
//       mood: "okay",
//       flowLevel: "medium",
//       symptoms: ["back pain"],
//       notes: "Slight back pain in the evening.",
//     },
//   ],
//   createdAt: "2025-07-31T14:09:43.227Z",
//   updatedAt: "2025-07-31T14:09:43.227Z",
//   __v: 0,
// };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState("sample-token");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // The original fetchUser logic is commented out to use sample data.
    const fetchUser = async () => {
      if (token) {
        try {
          const { data } = await api.get("/users/profile");
          setUser(data);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  const signup = async (userData) => {
    await api.post("/auth/signup", userData);
    await login(userData.username, userData.password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, signup, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
