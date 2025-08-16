"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Lock, ArrowLeft, Users, Heart } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/girl-login-signup.png";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import apiService from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

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
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await login(data);
      if (result.success) {
        toast.success("Welcome back!");
        
        // Redirect based on whether user needs cycle setup
        if (result.needsSetup) {
          router.push("/cycle-setup");
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error(result.error || "Invalid email or password");
      }
    } catch (error) {
      console.log(error);
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
              {/* Left side - Welcome & Features */}
              <div className="lg:w-1/2 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Image
                  src={logo}
                  alt="Flodiary"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right side - Login Form */}
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
                        Welcome Back
                      </h1>
                      <p className="text-gray-600">
                        Sign in to continue tracking your cycle
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                    autoComplete="off"
                  >
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
                          placeholder="your@email.com"
                          className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          autoComplete="email"
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
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10 pr-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          autoComplete="current-password"
                        />
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          id="remember"
                          name="remember"
                          type="checkbox"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm text-gray-600"
                        >
                          Remember me
                        </Label>
                      </div>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>

                  <div className="mt-8 text-center">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <Link
                        href="/register"
                        className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                      >
                        Sign up here
                      </Link>
                    </p>
                  </div>

                  <div className="mt-6 text-center">
                    <Badge
                      variant="secondary"
                      className="bg-purple-50 text-purple-700 border-purple-200"
                    >
                      <Users className="h-3 w-3 mr-1" />
                      Join thousands tracking with linear regression
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
