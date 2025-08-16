"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, Zap, Heart } from "lucide-react";
import { Toaster, toast } from "sonner";
import Image from "next/image";
import logo from "@/assets/girl-login-signup.png";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import apiService from "@/lib/api";

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const { signup, user } = useAuth();

  useEffect(() => {
    if (user) {
      // Check if user has cycles to determine where to redirect
      const checkUserStatus = async () => {
        try {
          const cyclesResponse = await apiService.getCycles();
          const hasCycles = cyclesResponse.cycles && cyclesResponse.cycles.length > 0;
          
          if (hasCycles) {
            router.push("/dashboard");
          } else {
            router.push("/cycle-setup");
          }
        } catch (error) {
          // If we can't check cycles, redirect to setup to be safe
          router.push("/cycle-setup");
        }
      };
      
      checkUserStatus();
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await signup(data);
      if (result.success) {
        toast.success("Account created successfully!");
        router.push("/cycle-setup");
      } else {
        toast.error(result.error || "An error occurred during signup.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
        <div className="w-full max-w-full">
          <div className="overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left side - Illustration & Info */}
              <div className="lg:w-1/2 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Image src={logo} alt="Flodiary" className="w-full h-full object-cover" />
              </div>

              {/* Right side - Registration Form */}
              <div className="lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                  <div className="mb-8">
                    <Link
                      href="/"
                      className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-6"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to home
                    </Link>

                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <Heart className="h-8 w-8 text-purple-600" />
                        <span className="text-2xl font-bold text-purple-900">
                          Flodiary
                        </span>
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Create Your Account
                      </h1>
                      <p className="text-gray-600">
                        Start tracking your cycle with linear regression
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-sm font-medium text-gray-700"
                        >
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          {...register("firstName")}
                          type="text"
                          placeholder="Jane"
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="text-sm font-medium text-gray-700"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          {...register("lastName")}
                          type="text"
                          placeholder="Doe"
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="username"
                        className="text-sm font-medium text-gray-700"
                      >
                        Username
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="username"
                          {...register("username")}
                          type="text"
                          placeholder="janedoe"
                          className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                      {errors.username && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.username.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          {...register("email")}
                          type="email"
                          placeholder="jane@example.com"
                          className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          {...register("password")}
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="pl-10 pr-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.password.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Must be at least 6 characters
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <input
                          id="terms"
                          type="checkbox"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-0.5"
                          required
                        />
                        <Label
                          htmlFor="terms"
                          className="text-sm text-gray-600"
                        >
                          I agree to the{" "}
                          <Link href="#" className="text-purple-600 hover:text-purple-700">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="#" className="text-purple-600 hover:text-purple-700">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                      </Button>
                    </div>
                  </form>

                  <div className="mt-8 text-center">
                    <p className="text-gray-600">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                      >
                        Sign in here
                      </Link>
                    </p>
                  </div>

                  <div className="mt-6 text-center">
                    <Badge
                      variant="secondary"
                      className="bg-purple-50 text-purple-700 border-purple-200"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Linear Regression Powered Predictions
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}