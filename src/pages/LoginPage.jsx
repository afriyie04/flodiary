import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import girlLoginSignup from "../assets/girl-login-signup.png";
import FormInput from "../components/FormInput";
import { Toaster, toast } from "sonner";
import "../assets/fonts/Italianno-Regular.ttf";

function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData.username, formData.password);
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during login."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-2xl overflow-hidden w-full flex my-auto">
          {/* Left side - Illustration */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-pink-50 to-purple-50 items-center justify-center p-8">
            <div className="text-center h-full">
              <img
                src={girlLoginSignup}
                alt="FloDiary Login"
                className="w-200 h-auto mx-auto mb-6 rounded-l-3xl"
              />
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="max-w-md mx-auto flex flex-col justify-center h-full">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-purple-800 mb-2">
                  Welcome to{" "}
                  <span
                    className="text-5xl"
                    style={{ fontFamily: "Italianno" }}
                  >
                    Flodiary
                  </span>
                </h1>
                <p className="text-gray-600">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  required
                />

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
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-purple-700 hover:text-purple-800 font-semibold"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>

              <div className="mt-4 text-center">
                <Link
                  to="/landing"
                  className="text-gray-500 hover:text-purple-700 text-sm"
                >
                  ← Back to landing page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
