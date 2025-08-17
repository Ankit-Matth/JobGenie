"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

const AboutUsPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    getSession().then(session => {
      setIsLoggedIn(!!session);
    });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen py-10 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="container mx-auto px-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-12 py-12 px-10">
          <div className="flex flex-col md:flex-row items-center md:space-x-8">
            <div className="md:w-2/3">
              <h2 className="text-4xl font-bold text-indigo-700 mb-4">
                Meet <span className="text-yellow-500">Job Genie</span>
              </h2>
              <p className="text-gray-700 mb-4 pr-4 text-lg text-justify">
              Tired of bouncing between multiple job sites? Job Genie is your magical one-stop platform for smarter job hunting! Discover listings from Shine, Naukri, and Internshala — all in one place. Say goodbye to tab toggling or juggling multiple platforms and let Job Genie work its magic on your career!
              </p>
              <h3 className="text-4xl font-bold text-indigo-700 mb-4">Our Mission</h3>
              <p className="text-gray-700 mb-4 pr-4 text-lg text-justify">
                At <strong>Job Genie</strong>, we aim to make job searching fast, efficient, and personalized. Our platform consolidates listings, giving you instant access to opportunities from top sources. Whether you’re a seasoned professional or just starting, our mission is to empower you to find your dream role with ease.
              </p>
            </div>
            <div className="md:w-1/3 p-4 flex items-center justify-center">
              <Image
                src="/images/about-us.jpg"
                alt="Job Genie"
                width={450}
                height={450}
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-12 py-12 px-6">
          <h3 className="text-4xl font-bold text-indigo-700 mb-12 text-center">What We Offer</h3>
          <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
            <div className="md:w-1/3 text-center">
              <Image
                src="/images/all-in-one-platform.png" 
                alt="Centralized Listings"
                width={250}
                height={250}
                className="object-cover rounded-lg shadow-lg mx-auto mb-4"
              />
              <h4 className="text-2xl font-semibold text-indigo-600 mb-2">Centralized Listings</h4>
              <p className="text-gray-600 w-[240px] mx-auto">
                Discover jobs from multiple platforms in one search, saving you time and effort.
              </p>
            </div>
            <div className="md:w-1/3 text-center">
              <Image
                src="/images/custom-filters.png"
                alt="Customized Filters"
                width={250}
                height={250}
                className="object-cover rounded-lg shadow-lg mx-auto mb-4"
              />
              <h4 className="text-2xl font-semibold text-indigo-600 mb-2">Customized Filters</h4>
              <p className="text-gray-600 w-[240px] mx-auto">
                Set preferences for job skills, job type, and locations to tailor your results.
              </p>
            </div>
            <div className="md:w-1/3 text-center">
              <Image
                src="/images/real-time-alerts.png"
                alt="Real-Time Alerts"
                width={250}
                height={250}
                className="object-cover rounded-lg shadow-lg mx-auto mb-4"
              />
              <h4 className="text-2xl font-semibold text-indigo-600 mb-2">Real-Time Alerts</h4>
              <p className="text-gray-600 w-[240px] mx-auto">
               Receive instant notifications about new opportunities directly in your inbox.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-700 shadow-lg rounded-lg overflow-hidden pt-12 pb-14 px-6 text-center text-white">
          <h3 className="text-4xl font-bold mb-4">Ready to Find Your Dream Job?</h3>
          <p className="mb-8 text-lg">
            Join <strong>Job Genie</strong> today and start receiving opportunities tailored just for you.
          </p>
          <Link href={isLoggedIn ? '/dashboard' : '/login'} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-lg transition duration-200 mt-4">
            {isLoggedIn ? 'Set Preferences for Job Alerts' : 'Create Your Free Account'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
