"use client";
import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  if (status === "loading") {
    return <p className="text-center text-2xl font-semibold">Loading...</p>;
  }

  if (!session) {
    return <p className="text-center text-2xl font-semibold">You are not signed in.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-100">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-4xl w-full space-y-10">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Welcome, {session.user.fullName}!
        </h1>
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-gray-50 py-4 px-6 rounded-lg shadow-sm">
            <span className="font-medium text-gray-500">Full Name:</span>
            <span className="font-semibold text-gray-800">{session.user.fullName}</span>
          </div>
          <div className="flex justify-between items-center bg-gray-50 py-4 px-6 rounded-lg shadow-sm">
            <span className="font-medium text-gray-500">Email:</span>
            <span className="font-semibold text-gray-800">{session.user.email}</span>
          </div>
          <div className="flex justify-between items-center bg-gray-50 py-4 px-6 rounded-lg shadow-sm">
            <span className="font-medium text-gray-500">Password:</span>
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-800">
                {showPassword ? session.user.decryptedPassword : "*********"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleSignOut}
            className="bg-gray-800 hover:bg-black text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 shadow-md hover:shadow-lg"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
