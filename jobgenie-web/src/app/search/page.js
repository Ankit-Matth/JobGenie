"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const platforms = ["All", "Shine", "Naukri", "Internshala"];

const SearchPage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  
  const [scrapedJobs, setScrapedJobs] = useState([]);
  const [noResultFound, setNoResultFound] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [loading, setLoading] = useState(true); 
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || '');
  const [searchError, setSearchError] = useState(false);

  const [prev, setPrev] = useState(0);
  const [next, setNext] = useState(6);

  const steps = [
    "Scraping data from Shine.com",
    "Scraping data from Naukri.com",
    "Scraping data from Internshala",
    "Analysing & processing all data",
  ];

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

useEffect(() => {
  if (!query) return;

  setLoading(true);
  setLoadingStep(0);
  setScrapedJobs([]);
  setNoResultFound(false);

  fetch('/api/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isDataScraped) {
        setProgress(100);
        setScrapedJobs(shuffleArray(data.scrapedJobs)); // shuffle here
        setTimeout(() => setLoading(false), 1000);
      } else {
        setProgress(100);
        setTimeout(() => setLoading(false), 1000);
        setNoResultFound(true);
      }
    })
    .catch(() => alert('Error occurred while scraping data'));
}, [query]); // run again whenever query from URL changes


  // Simulate loading with multiple steps
useEffect(() => {
  let rafId;
  let startTime = null;

  const stepDuration = 700;
  const progressIncrement = 10;

  const animateProgress = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    setProgress((prev) => {
      const next = prev + (progressIncrement * elapsed) / (stepDuration*3);

      // If it's the last step, cap at 80%
      if (loadingStep === steps.length - 1) {
        return Math.min(next, 80);
      }

      return Math.min(next, 100);
    });

    if (elapsed < stepDuration) {
      rafId = requestAnimationFrame(animateProgress);
    } else {
      if (loadingStep < steps.length - 1) {
        setTimeout(() => {
          setLoadingStep((prev) => prev + 1);
          setProgress(0);
          startTime = null;
        }, 1000);
      }
    }
  };

  if (loadingStep < steps.length) {
    rafId = requestAnimationFrame(animateProgress);
  }

  return () => cancelAnimationFrame(rafId);
}, [loadingStep]);

 const filteredJobs = useMemo(() => {
  return scrapedJobs.filter((job) => {
    const matchesPlatform =
      selectedPlatform === "All" || job.platform === selectedPlatform;
    return matchesPlatform;
  });
}, [scrapedJobs, selectedPlatform]);

useEffect(() => {
  setPrev(0);
  setNext(6);
}, [selectedPlatform, scrapedJobs])

const handleSearch = (e) => {
  e.preventDefault();
  if (searchQuery) {
    setSelectedPlatform("All");
    setPrev(0);
    setNext(6);
    router.push(`/search?query=${searchQuery}`);
  } else {
    setSearchError(true);
    setTimeout(() => setSearchError(false), 1200);
  }
};


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md py-6 md:pb-8 md:pt-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-2xl md:text-4xl font-semibold text-gray-800 mb-2 md:mb-0">Find the Job You Deserve</h1>
          <div className="relative w-[90%] md:w-2/5 mt-6 md:mt-0">
            <input
              type="text"
              onChange={(e)=>{setSearchQuery(e.target.value)}}
              value={searchQuery}
              disabled={loading}
              className={`w-full p-2 text-xs md:text-lg rounded-md focus:outline-blue-600 ring-2 ${searchError ? 'ring-red-700 placeholder-red-600' : 'ring-blue-300 placeholder-gray-400'}`}
              placeholder={searchError ? "Please type something in the search box..." : "Search for job roles, companies, or skills..."}
            />
            <button onClick={handleSearch} disabled={loading} className={`absolute right-0 top-0 h-full text-xs px-3 ${searchError ? 'bg-red-600' : 'bg-blue-600'} text-white rounded-md hover:bg-blue-700 transition duration-300`}>
              {searchError ? 'Error' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 shadow-md py-6">
        <div className="mx-auto px-4 md:px-12">
          <div className="flex items-center justify-between">
            <div className="flex space-x-6">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  className={`px-2 py-1 text-xs md:text-base  md:px-4 md:py-2 rounded-md ${
                    selectedPlatform === platform
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setSelectedPlatform(platform)}
                  disabled={loading || noResultFound}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
        <div className="flex flex-col justify-center items-center col-span-3 mt-5">
        {steps.slice(0, loadingStep + 1).map((step, index) => (
          <div key={index} className="w-2/3 md:w-1/2 my-2">
            <p className={`text-sm md:text-xl ${index === loadingStep ? "text-blue-600" : "text-gray-900"}`}>
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
          noResultFound ? (
            <div className="flex flex-row justify-center items-center col-span-3 mt-5 text-2xl">
            No results found for <span className="font-bold text-blue-600 ml-2">{query}</span>.
          </div> 
          ) : (
          <>
            {filteredJobs.slice(prev, next).map((job) => (
            <div
              key={job.id}
              className="bg-white shadow-md rounded-md p-4 md:p-6 hover:shadow-lg flex flex-col justify-between break-words"
              style={{ pointerEvents: (loading || noResultFound) ? "none" : "auto" }} // Disable pointer events during loading
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 className="text-sm md:text-lg font-semibold text-gray-800 break-words">
                  {job.title}
                </h2>
                <span className="text-xs md:text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-md">
                  {job.platform}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{job.company}</p>
              <p className="text-gray-500 text-sm">{job.location}</p>
              <p className="text-gray-800 font-bold text-sm">{job.experience}</p>
              
              <div className="my-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600"`}
                >
                  {job.posted}
                </span>
              </div>
              </div>
              
              <div>
                <a 
                href={job.src} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block mt-4"
              >
                <button
                  className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600"
                  disabled={loading || noResultFound} // Disable button during loading
                >
                  View Details
                </button>
              </a>
              </div>
            </div>
            ))}
          </>
        ))}
      </div>

      {!loading && !noResultFound &&
        <div
          className="col-span-3 flex justify-center pt-4 md:pt-8 pb-10 md:pb-16"
          style={{ pointerEvents: (loading || noResultFound) ? "none" : "auto" }} // Disable pointer events during loading
        >
          <button
            className={`px-2 py-1 ${prev == 0 ? 'hover:cursor-not-allowed' : ''} text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400`}
            disabled={loading || noResultFound} // Disable button during loading
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
            className={`px-2 py-1 ${next == filteredJobs.length ? 'hover:cursor-not-allowed' : ''} text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700`}
            disabled={loading || noResultFound} // Disable button during loading
            onClick={()=>{
              if (next !== filteredJobs.length) {
                setNext((val)=>val+6)
                setPrev((val)=>val+6)
              }
            }}
          >
            Next
          </button>
        </div>
      } 
    </div>
  );
};

export default SearchPage;