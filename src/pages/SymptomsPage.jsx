import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import PageHeader from "../components/PageHeader";

function SymptomsPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState({});
  const [mood, setMood] = useState(null);
  const [flow, setFlow] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const API_URL = "https://flodiary-api-2.onrender.com";

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const symptomCategories = {
    Physical: [
      { id: "cramps", name: "Cramps", icon: "😣" },
      { id: "headache", name: "Headache", icon: "🤕" },
      { id: "bloating", name: "Bloating", icon: "🤰" },
      { id: "breast_tenderness", name: "Breast Tenderness", icon: "😖" },
      { id: "fatigue", name: "Fatigue", icon: "😴" },
      { id: "acne", name: "Acne", icon: "😔" },
      { id: "nausea", name: "Nausea", icon: "🤢" },
      { id: "backache", name: "Backache", icon: "😰" },
    ],
    Emotional: [
      { id: "mood_swings", name: "Mood Swings", icon: "😅" },
      { id: "irritability", name: "Irritability", icon: "😠" },
      { id: "anxiety", name: "Anxiety", icon: "😰" },
      { id: "sadness", name: "Sadness", icon: "😢" },
      { id: "stress", name: "Stress", icon: "😫" },
      { id: "emotional", name: "Emotional", icon: "🥺" },
    ],
    Energy: [
      { id: "high_energy", name: "High Energy", icon: "⚡" },
      { id: "low_energy", name: "Low Energy", icon: "🔋" },
      { id: "motivated", name: "Motivated", icon: "💪" },
      { id: "sluggish", name: "Sluggish", icon: "🐌" },
    ],
  };

  const moods = [
    { id: "great", name: "Great", icon: "😄", color: "bg-green-200" },
    { id: "good", name: "Good", icon: "😊", color: "bg-blue-200" },
    { id: "okay", name: "Okay", icon: "😐", color: "bg-yellow-200" },
    { id: "bad", name: "Bad", icon: "😔", color: "bg-orange-200" },
    { id: "awful", name: "Awful", icon: "😢", color: "bg-red-200" },
  ];

  const flowLevels = [
    { id: "none", name: "None", icon: "○", color: "bg-gray-200" },
    { id: "light", name: "Light", icon: "◔", color: "bg-pink-200" },
    { id: "medium", name: "Medium", icon: "◑", color: "bg-pink-300" },
    { id: "heavy", name: "Heavy", icon: "●", color: "bg-red-300" },
  ];

  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [symptomId]: !prev[symptomId],
    }));
  };

  return (
    <DashboardLayout activePage="symptoms" title="Symptoms">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Symptoms"
          subtitle="Track how you're feeling today"
        />

        {/* Date Selector */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              <span className="text-gray-500">
                {new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  weekday: "short",
                })}
              </span>
            </h2>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="text-purple-600 hover:text-purple-800"
            />
          </div>
        </div>

        {/* Mood Tracking */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            How are you feeling?
          </h3>
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            {moods.map((moodOption) => (
              <button
                key={moodOption.id}
                onClick={() => setMood(moodOption.id)}
                className={`p-3 md:p-4 rounded-xl text-center transition-all hover:scale-105 ${
                  mood === moodOption.id
                    ? `${moodOption.color} ring-2 ring-purple-500`
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div className="text-xl md:text-2xl mb-1">
                  {moodOption.icon}
                </div>
                <div className="text-xs md:text-sm font-medium text-gray-700">
                  {moodOption.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Flow Tracking */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Flow Level
          </h3>
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {flowLevels.map((flowOption) => (
              <button
                key={flowOption.id}
                onClick={() => setFlow(flowOption.id)}
                className={`p-3 md:p-4 rounded-xl text-center transition-all hover:scale-105 ${
                  flow === flowOption.id
                    ? `${flowOption.color} ring-2 ring-purple-500`
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div className="text-xl md:text-2xl mb-1">
                  {flowOption.icon}
                </div>
                <div className="text-xs md:text-sm font-medium text-gray-700">
                  {flowOption.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms Categories */}
        {Object.entries(symptomCategories).map(([category, symptoms]) => (
          <div
            key={category}
            className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {category} Symptoms
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {symptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`p-3 rounded-xl text-center transition-all hover:scale-105 ${
                    selectedSymptoms[symptom.id]
                      ? "bg-purple-100 ring-2 ring-purple-500 text-purple-800"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <div className="text-lg md:text-xl mb-1">{symptom.icon}</div>
                  <div className="text-xs md:text-sm font-medium">
                    {symptom.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Notes Section */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
          <textarea
            placeholder="Add any additional notes about how you're feeling today..."
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows="4"
          />
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Save Symptoms
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SymptomsPage;
