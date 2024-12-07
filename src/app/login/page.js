"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Login = () => {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { name, email, password } = formData;

    try {
      if (!isSignIn) {
        await axios.post("/api/signup", { name, email, password });
        await handleSignIn(email, password);
      } else {
        await handleSignIn(email, password);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  const handleSignIn = async (email, password) => {
    const res = await axios.post("/api/signin", { email, password });
    if (res.data.success) {
      router.push("/");
    } else {
      throw new Error("Invalid email or password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="py-8 px-8">
          <h2 className="text-3xl font-bold text-center mb-8">{isSignIn ? "Sign In" : "Sign Up"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignIn && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">
              {isSignIn ? "Sign In" : "Sign Up"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <p className="mt-4 text-center">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => setIsSignIn(!isSignIn)} className="text-blue-500 cursor-pointer ml-1">
              {isSignIn ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
