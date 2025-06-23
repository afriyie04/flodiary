import React from "react";

function PageHeader({ title, subtitle, showMobileTitle = false }) {
  return (
    <div className="mb-6 md:mb-8">
      {showMobileTitle ? (
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
      ) : (
        <h1 className="hidden md:block text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="text-sm md:text-base text-gray-600">{subtitle}</p>
      )}
    </div>
  );
}

export default PageHeader;
