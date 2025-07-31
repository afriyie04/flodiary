import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import PageHeader from "../components/PageHeader";
import ToggleSwitch from "../components/ToggleSwitch";
import CycleSettings from "../components/CycleSettings";

function ProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "Akua",
    lastName: "Osei",
    email: "akua.osei@email.com",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleChange = (category, setting, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  return (
    <DashboardLayout activePage="profile" title="Profile">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Profile"
          subtitle="Manage your account settings and preferences"
        />

        <div className="space-y-6">
          {/* Profile Information */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Profile Information
            </h3>

            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {formData.firstName[0]}
                  {formData.lastName[0]}
                </span>
              </div>
              <div>
                <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Change Photo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Cycle Settings */}
          <CycleSettings />

          {/* Account Actions */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <button className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                Save Changes
              </button>

              <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-3 rounded-xl transition-colors">
                Delete Account
              </button>

              <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-3 rounded-xl transition-colors">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;
