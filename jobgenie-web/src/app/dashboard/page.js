'use client';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('dashboard');

  const [fullName, setFullName] = useState(session?.user?.fullName || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [editingProfile, setEditingProfile] = useState(false);

  const [skills, setSkills] = useState(session?.user?.preferredSkills || '');
  const [jobType, setJobType] = useState(session?.user?.preferredJobType || '');
  const [locations, setLocations] = useState(session?.user?.preferredLocations || '');
  const [editingPref, setEditingPref] = useState(false);

  if (status === 'loading') return <div className="text-center mt-10">Loading...</div>;
  if (!session) return <div className="text-center mt-10">Not signed in.</div>;

  const handleProfileSave = async () => { 
    setEditingProfile(false);
    try {
      const response = await axios.post('/api/saveData', {
        fullName: fullName,
        email: email,
      });
  
      if (response.status === 200) {
        // Sign in the user automatically after verification to upadte session
        await signIn('credentials', { user: response.data.user, redirect: false });
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('An error occurred while saving the profile.');
    }
  };

  const handlePrefSave = async () => {
    setEditingPref(false);
    try {
      const preferences = {skills, jobType, locations};
      const response = await axios.post('/api/saveData', {
        preferences: preferences,
        email: email,
      });
  
      if (response.status === 200) {
        // Sign in the user automatically after verification to upadte session
        await signIn('credentials', { user: response.data.user, redirect: false });
      } else {
        alert('Failed to update preferences.');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('An error occurred while saving the preferences.');
    }
  };

  // Email verification check
  if (session.user.isEmailVerified) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="max-w-xl mx-auto my-20 bg-white rounded-2xl shadow-lg p-14 text-center">
          <h2 className="text-5xl font-bold text-red-600 mb-6">Oops!</h2>
          <p className="text-gray-700 text-lg mb-8">
            Please verify your email first to access the dashboard.
          </p>
          <Link
            href={'/verify'}
            className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700"
          >
            Verify Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-1 mb-2">
      <div className="min-h-[60vh] m-6 bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Welcome back, {session.user.fullName}!</h2>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b flex bg-gray-50 px-8 pt-4 space-x-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-4 font-medium border-b-2 ${
              activeTab === 'dashboard'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-blue-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-2 px-4 font-medium border-b-2 ${
              activeTab === 'preferences'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-blue-600'
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-4 font-medium border-b-2 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-blue-600'
            }`}
          >
            Profile
          </button>
        </div>

        {/* Main Content */}
        <div className="px-8 py-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Jobs sent to your email</h3>
              ....... listing from MongoDB collection
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Job Preferences</h3>
              {!editingPref ? (
                <div className="space-y-4">
                  <div className="flex justify-between bg-gray-100 p-3">
                    <span className="text-gray-600">Preferred Skills</span>
                    <span className="font-semibold">{skills}</span>
                  </div>
                  <div className="flex justify-between bg-gray-100 p-3">
                    <span className="text-gray-600">Preferred Job Type</span>
                    <span className="font-semibold">{jobType}</span>
                  </div>
                  <div className="flex justify-between bg-gray-100 p-3">
                    <span className="text-gray-600">Preferred Locations</span>
                    <span className="font-semibold">{locations}</span>
                  </div>
                  <button
                    onClick={() => setEditingPref(true)}
                    className="mt-4 bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Edit Preferences
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <i>*Enter comma-separated values for multiple entries.</i>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">Preferred Skills</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full border rounded-lg px-4 py-2"
                      placeholder="e.g., React, Node.js, Python"
                    />
                  </div>

                  {/* Job Type */}
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">Preferred Job Type</label>
                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full border rounded-lg px-4 py-2"
                    >
                      <option value="None">None</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                      <option value="Fresher">Fresher</option>
                    </select>
                  </div>

                  {/* Locations */}
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">Preferred Locations</label>
                    <input
                      type="text"
                      value={locations}
                      onChange={(e) => setLocations(e.target.value)}
                      className="w-full border rounded-lg px-4 py-2"
                      placeholder="e.g., Delhi, Remote"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handlePrefSave}
                      className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingPref(false)}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Your Info</h3>
              {!editingProfile ? (
                <div className="space-y-4">
                  <div className="flex justify-between bg-gray-100 p-3">
                    <span className="text-gray-600">Full Name</span>
                    <span className="font-semibold">{fullName}</span>
                  </div>
                  <div className="flex justify-between bg-gray-100 p-3">
                    <span className="text-gray-600">Email</span>
                    <span className="font-semibold">{email}</span>
                  </div>
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="mt-4 bg-blue-600 text-white text-sm px-3 py-2 rounded-xl hover:bg-blue-700"
                  >
                    Edit Name
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      readOnly={true}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleProfileSave}
                      className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProfile(false)}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
