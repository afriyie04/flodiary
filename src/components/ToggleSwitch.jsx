import React from "react";

function ToggleSwitch({ enabled, onChange, size = "default" }) {
  const sizeClasses = {
    small: "h-5 w-9",
    default: "h-6 w-11",
    large: "h-7 w-13",
  };

  const switchClasses = {
    small: "h-3 w-3",
    default: "h-4 w-4",
    large: "h-5 w-5",
  };

  const translateClasses = {
    small: enabled ? "translate-x-5" : "translate-x-1",
    default: enabled ? "translate-x-6" : "translate-x-1",
    large: enabled ? "translate-x-7" : "translate-x-1",
  };

  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex ${
        sizeClasses[size]
      } items-center rounded-full transition-colors ${
        enabled ? "bg-purple-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block ${switchClasses[size]} transform rounded-full bg-white transition-transform ${translateClasses[size]}`}
      />
    </button>
  );
}

export default ToggleSwitch;
