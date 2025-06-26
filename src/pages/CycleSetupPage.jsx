import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import PageHeader from "../components/PageHeader";
import CycleSettings from "../components/CycleSettings";

function CycleSetupPage() {
  return (
    <DashboardLayout activePage="cycle-setup" title="Cycle Setup">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Cycle Setup"
          subtitle="Configure your cycle information for accurate predictions and tracking"
        />

        <div className="space-y-6">
          {/* Main Cycle Settings */}
          <CycleSettings />

          {/* Additional Information */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-purple-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Why This Information Matters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Accurate Predictions
                  </h4>
                  <p className="text-sm text-gray-600">
                    Helps predict your next period and fertile window more
                    precisely
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-pink-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Personalized Insights
                  </h4>
                  <p className="text-sm text-gray-600">
                    Generates insights tailored to your unique cycle patterns
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Better Health Tracking
                  </h4>
                  <p className="text-sm text-gray-600">
                    Enables comprehensive monitoring of your reproductive health
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📝 Quick Tips
            </h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <span className="text-purple-600 font-semibold">•</span>
                <p className="text-sm text-gray-600">
                  <strong>Don't know your exact numbers?</strong> Start with
                  estimates - you can always update them later as you track more
                  cycles.
                </p>
              </div>

              <div className="flex items-start space-x-2">
                <span className="text-purple-600 font-semibold">•</span>
                <p className="text-sm text-gray-600">
                  <strong>Track for 3 months:</strong> The app becomes more
                  accurate as it learns your patterns over time.
                </p>
              </div>

              <div className="flex items-start space-x-2">
                <span className="text-purple-600 font-semibold">•</span>
                <p className="text-sm text-gray-600">
                  <strong>Update regularly:</strong> Your cycle can change due
                  to stress, lifestyle, or health factors.
                </p>
              </div>

              <div className="flex items-start space-x-2">
                <span className="text-purple-600 font-semibold">•</span>
                <p className="text-sm text-gray-600">
                  <strong>Normal range:</strong> Cycle lengths between 21-45
                  days and periods lasting 2-10 days are typically normal.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Save & Continue to Dashboard
            </button>
            <button className="flex-1 border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CycleSetupPage;
