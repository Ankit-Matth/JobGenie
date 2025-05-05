'use client';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import axios from 'axios';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('profile');

  const [fullName, setFullName] = useState(session?.user?.fullName || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [editingProfile, setEditingProfile] = useState(false);

  const [roles, setRoles] = useState('None');
  const [locations, setLocations] = useState('None');
  const [companies, setCompanies] = useState('None');
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
        alert('Profile updated!');
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
      const preferences = {roles, locations, companies};
      const response = await axios.post('/api/saveData', {
        preferences: preferences,
        email: email,
      });
  
      if (response.status === 200) {
        alert('Preferences saved!');
      } else {
        alert('Failed to update preferences.');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('An error occurred while saving the preferences.');
    }
  };

  return (
    <div className="bg-gray-100 p-6 mb-2">
      <div className="max-w-6xl mx-auto my-6 bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Welcome, {session.user.fullName}</h2>
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
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-4 font-medium border-b-2 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-blue-600'
            }`}
          >
            Profile
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
        </div>

        {/* Main Content */}
        <div className="px-8 py-6">
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
                    Edit Profile
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

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Job Preferences</h3>
              {!editingPref ? (
                <div className="space-y-4">
                  <div className="flex justify-between bg-gray-100 p-3">
                    <span className="text-gray-600">Preferred Roles</span>
                    <span className="font-semibold">{roles}</span>
                  </div>
                  <div className="flex justify-between bg-gray-100 p-3">
                    <span className="text-gray-600">Preferred Locations</span>
                    <span className="font-semibold">{locations}</span>
                  </div>
                  <div className="flex justify-between bg-gray-100 p-3">
                    <span className="text-gray-600">Preferred Companies</span>
                    <span className="font-semibold">{companies}</span>
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
                  <div className='text-sm text-gray-600'><i>*Enter comma-separated values for multiple entries.</i></div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">Preferred Roles</label>
                    <input
                      type="text"
                      value={roles}
                      onChange={(e) => setRoles(e.target.value)}
                      className="w-full border rounded-lg px-4 py-2"
                      placeholder="e.g., Developer, Analyst"
                    />
                  </div>
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
                  <div>
                    <label className="block mb-1 text-sm text-gray-600">Preferred Companies</label>
                    <input
                      type="text"
                      value={companies}
                      onChange={(e) => setCompanies(e.target.value)}
                      className="w-full border rounded-lg px-4 py-2"
                      placeholder="e.g., Google, Startups"
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
        </div>
      </div>
    </div>
  );
}
