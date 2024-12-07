"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderTextError, setPlaceholderTextError] = useState(false);

  useEffect(() => {
    getSession().then(session => {
      setIsLoggedIn(!!session);
    });
  }, []);

  const handleSearch = (e) => {
    if (searchQuery) {
      e.preventDefault();
      if (isLoggedIn) {
        router.push(`/search?query=${searchQuery}`);
      } else {
        router.push('/login');
      }
    } else {
      setPlaceholderTextError(true)
      setTimeout(() => {
        setPlaceholderTextError(false)
      }, 1200);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white p-6">
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-5xl font-extrabold text-gray-800 text-center mb-4">
            Discover Your Dream Job Effortlessly!
          </h1>
          <p className="mt-2 text-2xl text-gray-600 max-w-2xl text-center my-3">
            Streamline your job search across top platforms like LinkedIn, Naukri, and Internshala—all from one place.
          </p>

          <div className="relative w-full max-w-lg mb-8 mt-8">
            <input
              type="text"
              onChange={(e)=>{setSearchQuery(e.target.value)}}
              value={searchQuery}
              className={`w-full p-4 rounded-md focus:outline-blue-600 ring-2 ${placeholderTextError ? 'ring-red-700 placeholder-red-600' : 'ring-blue-300 placeholder-gray-400'}`}
              placeholder={placeholderTextError ? "Please type something in the search box..." : "Search for jobs, companies, or keywords..."}
            />
            <button onClick={handleSearch} className="absolute right-0 top-0 h-full px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
              Search
            </button>
          </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-14 mb-8">
        <div className="bg-gray-50 rounded-lg shadow-lg p-6 w-full max-w-72 transition-transform transform hover:scale-105 duration-300">
          <Image
            src="/images/job-search.png" 
            alt="Unified Job Search"
            width={250}
            height={100}
            className="rounded-lg mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">Unified Job Search</h2>
          <p className="text-gray-700">
            Search for jobs across LinkedIn, Naukri, and Internshala, all in one go. No more endless searching!
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-lg p-6 w-full max-w-72 transition-transform transform hover:scale-105 duration-300">
          <Image
            src="/images/dream-job.png" 
            alt="Personalized Job Alerts"
            width={250}
            height={100}
            className="rounded-lg mb-4 object-cover"
          />
          <h2 className="text-xl font-semibold mb-2">Personalized Job Alerts</h2>
          <p className="text-gray-700">
            Receive notifications directly to your email when jobs from your dream companies are posted.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-lg p-6 w-full max-w-72 transition-transform transform hover:scale-105 duration-300">
          <Image
            src="/images/job-listing.png" 
            alt="Advanced Filters"
            width={250}
            height={100}
            className="rounded-lg mb-4 object-cover"
          />
          <h2 className="text-xl font-semibold mb-2">Advanced Job Listings</h2>
          <p className="text-gray-700">
            Get the most relevant job listings tailored to your skills and interests with ease.
          </p>
        </div>
      </div>

      <div className="text-center my-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          The Job You Want, Delivered to Your Inbox
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          Build the Career You Deserve – Get Job Alerts on Your Terms
        </p>
        <button onClick={()=>{router.push('/login')}} className="py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-400 transition duration-300">
          Sign Up Now for Personalized Job Alerts
        </button>
      </div>
    </div>
  );
}
