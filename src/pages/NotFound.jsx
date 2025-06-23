import React from "react";
import { Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />

      <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold text-purple-200 mb-4">
              404
            </div>
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.469.901-6.063 2.377m-2.975.783C2.667 15.933 2 13.978 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z"
                />
              </svg>
            </div>
          </div>

          {/* Main Content */}
          <h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-6">
            Oops! Page Not Found
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            We couldn't find the page you're looking for. It might have been
            moved, deleted, or you entered the wrong URL.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/"
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all transform hover:scale-105 inline-block"
            >
              Go Back Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="border-2 border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white font-semibold px-8 py-4 rounded-full text-lg transition-all inline-block"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default NotFoundPage;
