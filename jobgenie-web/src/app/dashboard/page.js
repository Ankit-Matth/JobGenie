'use client';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';

{/* Custom Dropdown Component */}
function SmallDropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full md:w-[300px]">
      <div
        className="border rounded-lg px-4 h-11 cursor-pointer bg-white flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        <span>{value || "Select..."}</span>
        <span className="ml-2">▾</span>
      </div>

      {open && (
        <div className="absolute bottom-full mb-1 w-full border rounded-lg bg-white max-h-60 overflow-y-auto z-50 shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('preferences');

  const [fullName, setFullName] = useState(session?.user?.fullName || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [editingProfile, setEditingProfile] = useState(false);

  const [skills, setSkills] = useState(session?.user?.preferredSkills || '');
  const [locations, setLocations] = useState(session?.user?.preferredLocations || '');
  const [editingPref, setEditingPref] = useState(false);

  if (status === 'loading') return <div className="text-center mt-10">Loading...</div>;
  if (!session) return <div className="text-center mt-10">Not signed in.</div>;

  const skillsOptions = [
    "None", "AI", "Angular", "AWS", "Azure", "Business Development", "C", "C#", "C++", "Cloud Computing", "Content Writing",
    "Cybersecurity", "Customer Support", "Data Science", "DevOps", "Digital Marketing", "Django", "Docker", "Elasticsearch", "Express", "Flask",
    "Go", "Graphic Design", "GraphQL", "GCP", "Java", "JavaScript", "Kotlin", "Kubernetes", "Laravel", "Linux",
    "Machine Learning", "MongoDB", "MySQL", "Networking", "Next.js", "NLP", "Node.js", "PHP", "PostgreSQL", "Python",
    "React", "Redis", "Ruby", "Rust", "Sales", "Scala", "SEO", "Spring Boot", "Swift", "TypeScript",
    "UI/UX Design", "Vue.js"
  ];

  const locationOptions = [
    "None", "Ahmedabad", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bangalore", "Bhopal", "Bihar", "Chandigarh", "Chennai", "Chhattisgarh",
    "Delhi", "Goa", "Gujarat", "Gurgaon", "Himachal Pradesh", "Hyderabad", "Indore", "Jaipur", "Jharkhand", "Karnataka",
    "Kerala", "Kolkata", "Lucknow", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Mumbai", "Nagaland", "Nagpur",
    "Noida", "Odisha", "Patna", "Punjab", "Pune", "Rajasthan", "Remote", "Sikkim", "Singapore", "Surat",
    "Tamil Nadu", "Telangana", "Tripura", "UK", "UP", "USA", "Uttarakhand", "West Bengal"
  ];

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
      const preferences = {skills, locations};
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

  if (!session.user.isEmailVerified) {
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
      <div className="min-h-[60vh] m-6 bg-white rounded-2xl shadow-lg overflow-visible">
        <div className="bg-blue-600 text-white px-4 md:px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <h2 className="text-base md:text-2xl font-bold">Welcome back, {session.user.fullName}!</h2>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-white text-blue-600 text-xs md:text-base px-2 py-1 md:px-4 md:py-2 rounded-md md:rounded-full font-semibold hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>

        <div className="border-b flex flex-row bg-gray-50 px-4 md:px-8 pt-4 space-y-2 sm:space-y-0 sm:space-x-4">
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

        <div className="px-8 py-6">
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Job Preferences</h3>
              {!editingPref ? (
                <div className="space-y-4">
                  <div className="text-red-600 text-xs md:text-base">
                    <i>*Support for more preferences coming soon...</i>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between bg-gray-100 p-3">
                    <span className="text-gray-600">Preferred Skills</span>
                    <span className="font-semibold">{skills}</span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between bg-gray-100 p-3">
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
                  <div className="text-red-600 text-xs md:text-base">
                    <i>*Must choose skills to receive email alerts.</i>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm text-gray-600">Preferred Skills</label>
                    <SmallDropdown options={skillsOptions} value={skills} onChange={setSkills} />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm text-gray-600">Preferred Locations</label>
                    <SmallDropdown options={locationOptions} value={locations} onChange={setLocations} />
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
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

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Your Info</h3>
              {!editingProfile ? (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row justify-between bg-gray-100 p-3">
                    <span className="text-gray-600">Full Name</span>
                    <span className="font-semibold">{fullName}</span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between bg-gray-100 p-3">
                    <span className="text-gray-600">Email</span>
                    <span className="font-semibold text-xs md:text-base">{email}</span>
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
                      className="w-full px-4 py-2 text-xs md:text-base border rounded-lg focus:outline-none"
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
