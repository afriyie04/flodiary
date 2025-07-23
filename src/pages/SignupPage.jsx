import React, { useState } from "react";
import { Link } from "react-router-dom";
import girlLoginSignup from "../assets/girl-login-signup.png";
import FormInput from "../components/FormInput";

function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "", //changes i made
    
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup submitted:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex">
        {/* Left side - Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-pink-50 to-purple-50 items-center justify-center p-8">
          <div className="text-center">
            <img
              src={girlLoginSignup}
              alt="FloDiary Signup"
              className="w-80 h-auto mx-auto mb-6"
            />
          </div>
        </div>

        {/* Right side - Signup Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-purple-800 mb-2">
                Welcome to FloDiary
              </h1>
              <p className="text-gray-600">Create your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  required
                />

                <FormInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  required
                />
              </div>

              <FormInput
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a username"
                required
              />

              <FormInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
              {/* something new i added */}
              <FormInput
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors transform hover:scale-105"
              >
                Create Account
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-purple-700 hover:text-purple-800 font-semibold"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-gray-500 hover:text-purple-700 text-sm"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
