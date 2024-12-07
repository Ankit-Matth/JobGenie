import Image from "next/image";
import Link from "next/link";

const AboutUsPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen py-10 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="container mx-auto px-6">
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-12 py-12 px-10">
          <div className="flex flex-col md:flex-row items-center md:space-x-8">
            <div className="md:w-2/3">
              <h2 className="text-5xl font-bold text-indigo-700 mb-4">
                Meet <span className="text-yellow-500">The Job Genie</span>
              </h2>
              <p className="text-gray-700 mb-6 text-lg text-justify">
                <strong>The Job Genie</strong> is your one-stop platform for a smarter, easier job search. We bring you job listings from top platforms like LinkedIn, Naukri, and Internshala—all in one place. No more toggling between tabs; let The Job Genie grant your job search wishes!
              </p>
              <h3 className="text-4xl font-bold text-indigo-700 mb-4">Our Mission</h3>
              <p className="text-gray-700 mb-4 text-lg text-justify">
                At <strong>The Job Genie</strong>, we aim to make job searching fast, efficient, and personalized. Our platform consolidates listings, giving you instant access to opportunities from top sources. Whether you’re a seasoned professional or just starting, our mission is to empower you to find your dream role with ease.
              </p>
            </div>
            <div className="md:w-1/3 p-4 flex items-center justify-center">
              <Image
                src="/images/the-job-genie.jpeg" // Replace with your actual image path
                alt="The Job Genie logo"
                width={450}
                height={450}
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-12 py-12 px-6">
          <h3 className="text-4xl font-bold text-indigo-700 mb-12 text-center">What We Offer</h3>
          <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
            <div className="md:w-1/3 text-center">
              <Image
                src="/images/all-in-one-platform.png" // Replace with your actual image path
                alt="Centralized Listings"
                width={300}
                height={300}
                className="object-cover rounded-lg shadow-lg mx-auto mb-4"
              />
              <h4 className="text-2xl font-semibold text-indigo-600 mb-2">Centralized Listings</h4>
              <p className="text-gray-600 text-lg">
                Discover jobs from multiple platforms in one search, saving you time and effort.
              </p>
            </div>
            <div className="md:w-1/3 text-center">
              <Image
                src="/images/custom-filters.png" // Replace with your actual image path
                alt="Customized Filters"
                width={300}
                height={300}
                className="object-cover rounded-lg shadow-lg mx-auto mb-4"
              />
              <h4 className="text-2xl font-semibold text-indigo-600 mb-2">Customized Filters</h4>
              <p className="text-gray-600 text-lg">
                Set preferences for job roles, locations, and companies to tailor your results.
              </p>
            </div>
            <div className="md:w-1/3 text-center">
              <Image
                src="/images/real-time-alerts.png" // Replace with your actual image path
                alt="Real-Time Alerts"
                width={300}
                height={300}
                className="object-cover rounded-lg shadow-lg mx-auto mb-4"
              />
              <h4 className="text-2xl font-semibold text-indigo-600 mb-2">Real-Time Alerts</h4>
              <p className="text-gray-600 text-lg">
                Receive instant notifications for new opportunities on your personalized dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Call-to-Action Section */}
        <div className="bg-indigo-700 shadow-lg rounded-lg overflow-hidden pt-12 pb-14 px-6 text-center text-white">
          <h3 className="text-4xl font-bold mb-4">Ready to Find Your Dream Job?</h3>
          <p className="mb-8 text-lg">
            Join <strong>The Job Genie</strong> today and start receiving opportunities tailored just for you.
          </p>
          <Link href={'/login'} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-lg transition duration-200 mt-4">
            Create Your Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
