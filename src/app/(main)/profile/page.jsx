"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Heart,
  Activity,
  Target,
  Plus,
  LogOut,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import apiService from "@/lib/api";

export default function ProfilePage() {
  const { user, checkAuth, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  });
  const [cycleStats, setCycleStats] = useState(null);

  const [tempData, setTempData] = useState(profileData);

  // Load user data and cycle stats when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          const userData = {
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            username: user.username || "",
            email: user.email || "",
          };
          setProfileData(userData);
          setTempData(userData);

          // Load cycle stats
          try {
            const stats = await apiService.getCycleStats();
            setCycleStats(stats);
          } catch (error) {
            console.error("Error loading cycle stats:", error);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleEdit = () => {
    setTempData(profileData);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updateData = {
        firstName: tempData.firstName,
        lastName: tempData.lastName,
        email: tempData.email,
      };

      const updatedUser = await apiService.updateProfile(updateData);
      setProfileData(tempData);
      setIsEditing(false);

      // Update auth context with new user data
      await checkAuth();

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  const statsCards = [
    {
      label: "Cycles Tracked",
      value: cycleStats?.totalCycles || "0",
      icon: Activity,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Average Cycle Length",
      value: cycleStats?.averageCycleLength
        ? `${cycleStats.averageCycleLength} days`
        : "0",
      icon: Target,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Regularity Score",
      value: cycleStats?.regularityScore
        ? `${cycleStats.regularityScore}%`
        : "0%",
      icon: Heart,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <Toaster />
      <div className="mx-auto space-y-6 w-full max-w-full">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsCards.map((stat, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6">
                <div
                  className={`inline-flex p-3 rounded-full ${stat.color} mb-4`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  size="sm"
                  onClick={isEditing ? handleCancel : handleEdit}
                >
                  {isEditing ? (
                    <X className="w-4 h-4 mr-2" />
                  ) : (
                    <Edit3 className="w-4 h-4 mr-2" />
                  )}
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <Input
                        id="firstName"
                        value={
                          isEditing ? tempData.firstName : profileData.firstName
                        }
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        disabled={!isEditing}
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <Input
                        id="lastName"
                        value={
                          isEditing ? tempData.lastName : profileData.lastName
                        }
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        disabled={!isEditing}
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={isEditing ? tempData.email : profileData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!isEditing}
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cycle Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Cycle Information
                </CardTitle>
                <CardDescription>
                  Your cycle tracking preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cycleLength">
                      Average Cycle Length (days)
                    </Label>
                    <Input
                      id="cycleLength"
                      type="number"
                      value={cycleStats?.averageCycleLength || 0}
                      disabled
                      className="pl-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastCycle">Last Period Date</Label>
                    <Input
                      id="lastCycle"
                      type="date"
                      value={
                        cycleStats?.lastPeriodDate
                          ? new Date(cycleStats.lastPeriodDate)
                              .toISOString()
                              .split("T")[0]
                          : new Date().toISOString().split("T")[0]
                      }
                      disabled
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-700"
                  >
                    Next Period:{" "}
                    {cycleStats?.nextPeriodDate
                      ? new Date(cycleStats.nextPeriodDate).toLocaleDateString()
                      : "No data"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-700"
                  >
                    Total Cycles: {cycleStats?.totalCycles || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Cycle Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Cycle Setup
                </CardTitle>
                <CardDescription>
                  Configure your cycle tracking preferences and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900">
                        Cycle Data Configuration
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Update your cycle length data, add historical cycles, or
                        modify your tracking preferences.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Setup Status</Label>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-700"
                      >
                        Configured
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {cycleStats?.totalCycles || 0} cycles of data
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Last Updated</Label>
                    <div className="text-sm text-gray-600">
                      {cycleStats?.lastUpdated
                        ? new Date(cycleStats.lastUpdated).toLocaleDateString()
                        : "No data"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold mb-4">
                    {user
                      ? `${user.firstName?.[0] || ""}${
                          user.lastName?.[0] || ""
                        }`.trim() || "U"
                      : "U"}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button
                  onClick={() => toast.info("Coming soon")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  Two-Factor Authentication
                </Button>
                <Button
                  onClick={() => toast.info("Coming soon")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  Privacy Settings
                </Button>
                <Button
                  onClick={() => {
                    logout();
                    toast.success("Logged out successfully");
                  }}
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
