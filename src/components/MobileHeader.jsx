import React from "react";

function MobileHeader({ title, onMenuClick }) {
  return (
    <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-md text-gray-600 hover:text-purple-800 hover:bg-gray-100"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <div className="w-10"></div>
    </div>
  );
}

export default MobileHeader;
