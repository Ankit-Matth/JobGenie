import Link from 'next/link';
import React, { useState } from 'react';

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [shake, setShake] = useState(false);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
    setShake(false);
  };

  const handleOverlayClick = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Content for Terms of Service and Privacy Policy
  const content = {
    terms: (
      <>
        <h2 className="text-xl font-semibold mb-4">Terms of Service</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
          <li>These terms govern the use of &quot;Job Genie&quot; platform.</li>
          <li>
            Users are expected to provide accurate information and use the platform for lawful
            purposes.
          </li>
          <li>
            &quot;Job Genie&quot; aggregates job listings but is not responsible for third-party
            inaccuracies or hiring outcomes.
          </li>
          <li>
            Any disruptive, fraudulent, or abusive activity can result in account termination.
          </li>
          <li>
            Terms may be updated periodically, and users will be notified of significant changes.
          </li>
        </ul>
      </>
    ),
    privacy: (
      <>
        <h2 className="text-xl font-semibold mb-4">Privacy Policy</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
          <li>
            We collect account information, job preferences, and usage data to enhance your
            experience.
          </li>
          <li>
            Your data is used to personalize job alerts and improve platform features, and is not
            sold to third-party marketers.
          </li>
          <li>
            We use cookies for session management and remember search preferences.
          </li>
          <li>
            Users have rights to access, update, or delete their information at any time.
          </li>
          <li>
            Our policy may change periodically, and we will notify users of major updates.
          </li>
        </ul>
      </>
    ),
  };

  return (
    <>
      <footer className="bg-gray-900 text-white py-4">
        <div className="flex justify-between items-center px-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Job Genie – All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => openModal('privacy')}
              className="text-gray-400 hover:text-white transition duration-300 text-sm"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => openModal('terms')}
              className="text-gray-400 hover:text-white transition duration-300 text-sm"
            >
              Terms of Service
            </button>
            <Link href="/contact" className="text-gray-400 hover:text-white transition duration-300 text-sm">Contact Us</Link>
          </div>
        </div>
      </footer>

      {/* Modal Popup */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleOverlayClick} // Trigger shake on overlay click
        >
          <div
            className={`bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative ${
              shake ? 'animate-shake' : ''
            }`}
            onClick={(e) => e.stopPropagation()} // Prevent modal close on modal content click
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-semibold"
            >
              &times;
            </button>
            {modalContent === 'privacy' && content.privacy}
            {modalContent === 'terms' && content.terms}
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
