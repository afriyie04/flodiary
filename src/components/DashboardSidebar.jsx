import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const NavigationItem = ({ to, icon, children, active = false, onClick }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
      active
        ? "text-white bg-gradient-to-r from-purple-600 to-pink-500 shadow-md"
        : "text-gray-600 hover:bg-gray-100"
    }`}
    onClick={onClick}
  >
    {icon}
    <span className="font-medium">{children}</span>
  </Link>
);

const SidebarHeader = () => (
  <div className="p-6">
    <Link to="/" className="flex items-center group cursor-pointer">
      <div className="flex items-center space-x-2">
        <p
          style={{ fontFamily: "Italianno" }}
          className="text-5xl font-bold bg-gradient-to-r from-purple-800 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-900 group-hover:to-pink-700 transition-all duration-200"
        >
          FloDiary
        </p>
      </div>
    </Link>
  </div>
);

function DashboardSidebar({ sidebarOpen, setSidebarOpen, activePage }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const mainNavItems = [
    {
      to: "/dashboard",
      key: "dashboard",
      icon: (
        <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
      label: "Dashboard",
    },
    {
      to: "/calendar",
      key: "calendar",
      icon: (
        <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      label: "Calendar",
    },
    {
      to: "/symptoms",
      key: "symptoms",
      icon: (
        <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      ),
      label: "Symptoms",
    },
    {
      to: "/cycle-history",
      key: "cycle-history",
      icon: (
        <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      label: "Cycle History",
    },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        flex flex-col`}
      >
        <div>
          <SidebarHeader />
          <nav className="mt-4 px-4 space-y-2">
            {mainNavItems.map((item) => (
              <NavigationItem
                key={item.key}
                to={item.to}
                active={activePage === item.key}
                icon={item.icon}
                onClick={() => setSidebarOpen(false)}
              >
                {item.label}
              </NavigationItem>
            ))}
          </nav>
        </div>
        <div className="mt-auto">
          <nav className="px-4 space-y-2 mb-6">
            <NavigationItem
              to="/profile"
              active={activePage === "profile"}
              icon={
                <svg
                  className="w-6 h-6 mr-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              onClick={() => setSidebarOpen(false)}
            >
              Profile
            </NavigationItem>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 mr-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}

export default DashboardSidebar;
