"use client";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";

const Page = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [shake, setShake] = useState(false);

  const handleFullNameChange = (e) => setFullName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/contact", { fullName, email, description });
      setShowModal(true);
      document.body.style.overflow = "hidden"; // Disable scrolling
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setFullName("");
    setEmail("");
    setDescription("");
    setShowModal(false);
    document.body.style.overflow = "auto"; // Enable scrolling
    setShake(false);
  };

  const handleOverlayClick = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const ConfirmationModal = ({ onClose }) => {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 overflow-y-auto p-4"
        onClick={handleOverlayClick}
      >
        <div
          className={`bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative ${shake ? 'animate-shake' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-3xl text-gray-500 hover:text-gray-700 z-10"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
          <h2 className="text-2xl font-semibold mb-4 text-center">Thank You!</h2>
          <p className="text-gray-700 text-lg text-center">
            Your submission has been received successfully. We will contact you soon.
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      {showModal && <ConfirmationModal onClose={closeModal} />}
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-8 px-4">
        <div className="bg-white rounded-lg w-full max-w-5xl">
          <p className="text-2xl sm:text-3xl md:text-4xl text-gray-800 mb-10 text-center px-2 sm:px-0">
            We’re here to help! Reach out to us anytime.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full md:w-3/5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative font-medium">
                    <input
                      type="text"
                      className="peer w-full px-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 pt-6 pb-2"
                      id="fullName"
                      value={fullName}
                      onChange={handleFullNameChange}
                      required
                    />
                    <label
                      htmlFor="fullName"
                      className={`absolute left-4 transition-all duration-300 text-gray-600 ${
                        fullName
                          ? "text-sm top-1"
                          : "top-4 text-gray-600 peer-focus:text-sm peer-focus:top-1 peer-focus:text-blue-500"
                      }`}
                    >
                      Full Name
                    </label>
                  </div>
                  <div className="relative font-medium">
                    <input
                      type="email"
                      className="peer w-full px-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 pt-6 pb-2"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                    />
                    <label
                      htmlFor="email"
                      className={`absolute left-4 transition-all duration-300 text-gray-600 ${
                        email
                          ? "text-sm top-1"
                          : "top-4 text-gray-600 peer-focus:text-sm peer-focus:top-1 peer-focus:text-blue-500"
                      }`}
                    >
                      Email Address
                    </label>
                  </div>
                </div>

                <div className="relative font-medium">
                  <textarea
                    className="peer w-full px-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 pt-6 pb-2"
                    rows="4"
                    id="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    required
                  ></textarea>
                  <label
                    htmlFor="description"
                    className={`absolute left-4 transition-all duration-300 text-gray-600 ${
                      description
                        ? "text-sm top-1"
                        : "top-4 text-gray-600 peer-focus:text-sm peer-focus:top-1 peer-focus:text-blue-500"
                    }`}
                  >
                    Message
                  </label>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300 w-full text-lg"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="w-full md:w-2/5 flex justify-center">
              <Image
                src="/images/contact.jpg"
                alt="Contact Us"
                width={400}
                height={300}
                className="object-cover rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>

          <div className="mt-12 text-center md:text-left bg-gray-100 p-6 sm:p-8 rounded-lg shadow-md flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="w-full md:w-2/5 flex justify-center md:justify-start">
              <Image
                src="/images/JobGenie.png"
                alt="Our Office"
                width={400}
                height={300}
                className="object-cover w-full h-auto"
              />
            </div>
            <div className="w-full md:w-3/5 text-left">
              <div className="md:ml-4">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Our Office</h3>
                <p className="text-gray-700">Sector XYZ, Plot No. 123</p>
                <p className="text-gray-700">Bhiwani, Haryana, 127029</p>
                <p className="text-gray-700">Phone: (0000) 00000-00000</p>
                <p className="text-gray-700 mb-1">
                  Email: <a href="mailto:contact@jobgenie.com" className="text-blue-500">contact@jobgenie.com</a>
                </p>
                <p className="text-gray-800">
                  Your trusted partner in job placements and recruitment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
