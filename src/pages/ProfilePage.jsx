import React, { useState, useContext, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import PageHeader from "../components/PageHeader";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { Toaster, toast } from "sonner";

function ProfilePage() {
  const { user, setUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  });
  const [cycleData, setCycleData] = useState({
    avgCycleLength: "",
    avgPeriodDuration: "",
    lastPeriodDate: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
      });
      setCycleData({
        avgCycleLength: user.cycleDetails?.avgCycleLength || "",
        avgPeriodDuration: user.cycleDetails?.avgPeriodDuration || "",
        lastPeriodDate: user.cycleDetails?.lastPeriodDate
          ? new Date(user.cycleDetails.lastPeriodDate)
              .toISOString()
              .split("T")[0]
          : "",
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCycleChange = (e) => {
    const { name, value } = e.target;
    setCycleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async () => {
    try {
      const { data } = await api.put("/users/profile", profileData);
      setUser(data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleCycleUpdate = async () => {
    try {
      const { data } = await api.put("/users/profile/cycle", cycleData);
      setUser((prevUser) => ({ ...prevUser, cycleDetails: data }));
      toast.success("Cycle details updated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update cycle details."
      );
    }
  };

  return (
    <DashboardLayout activePage="profile" title="Profile">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Profile"
          subtitle="Manage your account settings and preferences"
        />
        <div className="space-y-6">
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Profile Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleProfileUpdate}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl"
              >
                Save Profile
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Cycle Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Average Cycle Length (days)
                </label>
                <input
                  type="number"
                  name="avgCycleLength"
                  value={cycleData.avgCycleLength}
                  onChange={handleCycleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Average Period Duration (days)
                </label>
                <input
                  type="number"
                  name="avgPeriodDuration"
                  value={cycleData.avgPeriodDuration}
                  onChange={handleCycleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Period Start Date
                </label>
                <input
                  type="date"
                  name="lastPeriodDate"
                  value={cycleData.lastPeriodDate}
                  onChange={handleCycleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleCycleUpdate}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl"
              >
                Save Cycle Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;
