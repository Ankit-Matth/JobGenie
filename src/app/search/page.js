"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const platforms = ["All", "Indeed", "Naukri", "Internshala"];

const filters = {
  location: ["Remote", "Bengaluru", "Mumbai", "Noida", "Hyderabad"],
  salaryRange: ["< 10k", "10k-50k", "50k-100k", "> 100k"],
  jobType: ["Full-Time", "Part-Time", "Internship", "Contract"],
};

const SearchPage = () => {
  const hasFetched = useRef(false);
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [filtersState, setFiltersState] = useState({
    location: "",
    salaryRange: "",
    jobType: "",
  });
  const [dummyJobs, setDummyJobs] = useState([]);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [loading, setLoading] = useState(true); 
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [nextQuery, setNextQuery] = useState('');
  const [placeholderTextError, setPlaceholderTextError] = useState(false);

  const [prev, setPrev] = useState(0);
  const [next, setNext] = useState(6);

  const steps = [
    "Scraping data from Indeed",
    "Scraping data from Naukri.com",
    "Scraping data from Internshala",
    "Analysing & processing all data",
  ];

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch('/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isDataScraped) {
          setDummyJobs(data.scrapedJobs);
          setLoading(false);
        } else {
          alert('Error occurred while scraping data');
        }
      })
      .catch(() => alert('Error occurred while scraping data'));
  }, [nextQuery]);

  // Derived state: Filtered jobs
  const filteredJobs = useMemo(() => {
      return dummyJobs.filter((job) => {
        const matchesPlatform =
          selectedPlatform === "All" || job.platform === selectedPlatform;
        const matchesLocation =
          !filtersState.location || job.location.includes(filtersState.location);
        const matchesSalary =
          !filtersState.salaryRange || job.salaryRange.includes(filtersState.salaryRange);
        const matchesJobType =
          !filtersState.jobType || job.jobType.includes(filtersState.jobType);
        return (
          matchesPlatform &&
          matchesLocation &&
          matchesSalary &&
          matchesJobType
        );
      });
    }, [dummyJobs, selectedPlatform, filtersState]);

  const handleFilterChange = (key, value) => {
    setFiltersState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e) => {
    if (searchQuery) {
      e.preventDefault();
      router.push(`/search?query=${searchQuery}`);
      hasFetched.current = false;
      setLoading(true);
      setLoadingStep(0);
      setNextQuery(searchQuery);
    } else {
      setPlaceholderTextError(true)
      setTimeout(() => {
        setPlaceholderTextError(false)
      }, 1200);
    }
  };

// Simulate loading with multiple steps
useEffect(() => {
  let rafId;
  let startTime = null;

  const stepDuration = 500; 
  const progressIncrement = 10; 

  const animateProgress = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    if (elapsed < stepDuration) {
      // Continue progressing with smooth animation
      setProgress((prev) => Math.min(prev + (progressIncrement * elapsed) / stepDuration, 300));
      rafId = requestAnimationFrame(animateProgress);
    } else {
      // Once the step duration is complete, move to the next step
      setProgress(100);
      setTimeout(() => {
        setLoadingStep((prev) => prev + 1);
        setProgress(0);
        startTime = null;
      }, 1000);
    }
  };

  if (loadingStep < steps.length) {
    rafId = requestAnimationFrame(animateProgress);
  }

  return () => {
    cancelAnimationFrame(rafId); // Clean up RAF
  };
}, [loadingStep]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md pb-8 pt-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-4xl font-semibold text-gray-800">Find the Job You Deserve</h1>
          <div className="relative w-full md:w-2/5 mt-4 md:mt-0">
            <input
              type="text"
              onChange={(e)=>{setSearchQuery(e.target.value)}}
              value={searchQuery}
              className={`w-full p-2 rounded-md focus:outline-blue-600 ring-2 ${placeholderTextError ? 'ring-red-700 placeholder-red-600' : 'ring-blue-300 placeholder-gray-400'}`}
              placeholder={placeholderTextError ? "Please type something in the search box..." : "Search for jobs, companies, or keywords..."}
            />
            <button onClick={handleSearch} className="absolute right-0 top-0 h-full px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
              Search
            </button>
          </div>
        </div>
      </header>

      {/* Filters and Tabs */}
      <div className="bg-gray-50 shadow-md py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Tabs */}
            <div className="flex space-x-4">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  className={`px-4 py-2 rounded-md ${
                    selectedPlatform === platform
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setSelectedPlatform(platform)}
                  disabled={loading}
                >
                  {platform}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex space-x-6">
              {Object.entries(filters).map(([key, options]) => (
                <select
                  key={key}
                  value={filtersState[key]}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                  className="p-2 bg-white border rounded-md ring-1 ring-gray-300 focus:ring-blue-500 focus:outline-none"
                  disabled={loading} // Disable filters during loading
                >
                  <option value="">{key.charAt(0).toUpperCase() + key.slice(1)}</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings and Pagination */}
      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Loading Phase */}
        {loading ? (
        <div className="flex flex-col justify-center items-center col-span-3 mt-5">
        {steps.slice(0, loadingStep + 1).map((step, index) => (
          <div key={index} className="w-1/2 my-2">
            <p className={`text-xl ${index === loadingStep ? "text-blue-600" : "text-gray-900"}`}>
              {step}
            </p>
            <div className="w-full bg-gray-300 rounded-md h-4 mt-1">
              <div
                className="bg-blue-600 h-4 rounded-md"
                style={{
                  width: `${index === loadingStep ? progress : 100}%`,
                  transition: "width 0.5s ease",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
        ) : (
          <>
            {/* Job Listings */}
            {filteredJobs.slice(prev, next).map((job) => (
            <div
              key={job.id}
              className="bg-white shadow-md rounded-md p-6 hover:shadow-lg transition"
              style={{ pointerEvents: loading ? "none" : "auto" }} // Disable pointer events during loading
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {job.title}
                </h2>
                <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-md">
                  {job.platform}
                </span>
              </div>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-gray-500">{job.location}</p>
              <p className="text-gray-800 font-bold">{job.salary}</p>
              
              <div className="my-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    job.jobType === "Full-Time"
                      ? "bg-green-100 text-green-600"
                      : job.jobType === "Part-Time"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {job.jobType}
                </span>
              </div>
              
              <div className="mt-3">
                <h3 className="text-sm font-semibold text-gray-600">
                  Skills Required:
                </h3>
                <ul className="text-gray-500 text-sm list-disc ml-5">
                  {job.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              
              <a 
                href={job.src} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block mt-4"
              >
                <button
                  className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600"
                  disabled={loading} // Disable button during loading
                >
                  View Details
                </button>
              </a>
            </div>
            ))}

            {/* Pagination */}
            <div
              className="col-span-3 flex justify-center py-6"
              style={{ pointerEvents: loading ? "none" : "auto" }} // Disable pointer events during loading
            >
              <button
                className={`px-2 py-1 ${prev == 0 ? 'hover:cursor-not-allowed' : ''} text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400`}
                disabled={loading} // Disable button during loading
                onClick={()=>{
                  if (prev !== 0) {
                    setPrev((val)=>val-6)
                    setNext((val)=>val-6)
                  }
                }}
              >
                Previous
              </button>
              <span className="mx-4">Page {Math.floor(prev / 6) + 1} of {Math.ceil(filteredJobs.length/6)}</span>
              <button
                className={`px-2 py-1 ${next == 12 ? 'hover:cursor-not-allowed' : ''} text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700`}
                disabled={loading} // Disable button during loading
                onClick={()=>{
                  if (next !== 12) {
                    setNext((val)=>val+6)
                    setPrev((val)=>val+6)
                  }
                }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
