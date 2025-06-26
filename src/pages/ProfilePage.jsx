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
    notifications: {
      periodReminder: true,
      ovulationReminder: true,
      symptomReminder: false,
      weeklyReport: true,
    },
    privacy: {
      shareData: false,
      analytics: true,
      marketing: false,
    },
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

          {/* Notification Settings */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Notifications
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Period Reminders
                  </h4>
                  <p className="text-sm text-gray-500">
                    Get notified before your period starts
                  </p>
                </div>
                <ToggleSwitch
                  enabled={formData.notifications.periodReminder}
                  onChange={(value) =>
                    handleToggleChange("notifications", "periodReminder", value)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Ovulation Reminders
                  </h4>
                  <p className="text-sm text-gray-500">
                    Get notified during your fertile window
                  </p>
                </div>
                <ToggleSwitch
                  enabled={formData.notifications.ovulationReminder}
                  onChange={(value) =>
                    handleToggleChange(
                      "notifications",
                      "ovulationReminder",
                      value
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Symptom Reminders
                  </h4>
                  <p className="text-sm text-gray-500">
                    Daily reminders to log symptoms
                  </p>
                </div>
                <ToggleSwitch
                  enabled={formData.notifications.symptomReminder}
                  onChange={(value) =>
                    handleToggleChange(
                      "notifications",
                      "symptomReminder",
                      value
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Weekly Reports
                  </h4>
                  <p className="text-sm text-gray-500">
                    Receive weekly cycle insights
                  </p>
                </div>
                <ToggleSwitch
                  enabled={formData.notifications.weeklyReport}
                  onChange={(value) =>
                    handleToggleChange("notifications", "weeklyReport", value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Privacy & Data
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Share Anonymous Data
                  </h4>
                  <p className="text-sm text-gray-500">
                    Help improve the app with anonymous usage data
                  </p>
                </div>
                <ToggleSwitch
                  enabled={formData.privacy.shareData}
                  onChange={(value) =>
                    handleToggleChange("privacy", "shareData", value)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Analytics
                  </h4>
                  <p className="text-sm text-gray-500">
                    Allow analytics to improve your experience
                  </p>
                </div>
                <ToggleSwitch
                  enabled={formData.privacy.analytics}
                  onChange={(value) =>
                    handleToggleChange("privacy", "analytics", value)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Marketing Communications
                  </h4>
                  <p className="text-sm text-gray-500">
                    Receive tips and updates about cycle health
                  </p>
                </div>
                <ToggleSwitch
                  enabled={formData.privacy.marketing}
                  onChange={(value) =>
                    handleToggleChange("privacy", "marketing", value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Account Actions
            </h3>

            <div className="space-y-4">
              <button className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                Save Changes
              </button>

              <div className="flex flex-col md:flex-row gap-4">
                <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-3 rounded-xl transition-colors">
                  Export My Data
                </button>
                <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-3 rounded-xl transition-colors">
                  Change Password
                </button>
                <button className="border border-red-300 text-red-600 hover:bg-red-50 font-medium px-6 py-3 rounded-xl transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;
