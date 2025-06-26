import React, { useState } from "react";
import FormInput from "./FormInput";

function CycleSettings() {
  const [cycleData, setCycleData] = useState({
    avgCycleLength: "28",
    avgPeriodDuration: "5",
    lastPeriodDate: "2025-01-15",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(cycleData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setCycleData(tempData);
    setIsEditing(false);
    // Here you would typically save to backend/localStorage
    console.log("Saving cycle data:", tempData);
  };

  const handleCancel = () => {
    setTempData(cycleData);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
          Cycle Information
        </h3>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors"
          >
            Edit
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors px-3 py-1 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-white bg-purple-600 hover:bg-purple-700 font-medium text-sm transition-colors px-3 py-1 rounded-lg"
            >
              Save
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4 md:space-y-6">
        {isEditing ? (
          <>
            <FormInput
              label="Average Cycle Length"
              type="number"
              name="avgCycleLength"
              value={tempData.avgCycleLength}
              onChange={handleInputChange}
              placeholder="28"
              min="21"
              max="45"
              className="w-full"
            />

            <FormInput
              label="Average Period Duration"
              type="number"
              name="avgPeriodDuration"
              value={tempData.avgPeriodDuration}
              onChange={handleInputChange}
              placeholder="5"
              min="2"
              max="10"
              className="w-full"
            />

            <FormInput
              label="Date of Last Period"
              type="date"
              name="lastPeriodDate"
              value={tempData.lastPeriodDate}
              onChange={handleInputChange}
              className="w-full"
            />

            <div className="text-xs md:text-sm text-gray-500 space-y-1">
              <p>• Cycle length is typically between 21-45 days</p>
              <p>• Period duration is usually 2-10 days</p>
              <p>• This information helps improve prediction accuracy</p>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Cycle Length</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {cycleData.avgCycleLength} days
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-pink-50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-pink-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Average Period Duration
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    {cycleData.avgPeriodDuration} days
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Period Date</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {new Date(cycleData.lastPeriodDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CycleSettings;
