"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { getSession, useSession } from "next-auth/react";

const Header = () => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const { data: session } = useSession();

  const handleLinkClick = (href) => {
    setActiveLink(href);
    setIsOpen(false);
  };

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  useEffect(() => {
    getSession().then(session => {
      setIsLoggedIn(!!session);
    });
  }, []);

  return (
    <>
    {session && !session.user.isEmailVerified && activeLink !== "/verify" && (
      <div className="bg-yellow-100 text-yellow-800 py-2 px-4 flex items-center justify-center text-base text-center md:text-left space-x-2">
        <span className="flex items-center space-x-2">
          <Image src="/images/email.png" alt="Email icon" width={20} height={20} />
          <span className="hidden md:inline">
            Please verify your email to get personalized alerts in your inbox.
          </span>
          <span className="inline md:hidden">
            Please verify your email.
          </span>
        </span>

        <Link
          href="/verify"
          onClick={() => handleLinkClick("/verify")}
          className="underline text-base font-medium hover:text-yellow-900"
        >
          Verify Now
        </Link>
        
      </div>
    )}

    <header className="py-3 shadow-md mb-[2px] relative md:static">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-0">
        <Link
          href="/"
          onClick={() => handleLinkClick("/")}
          className="flex items-center space-x-2 md:ml-0"
        >
          <Image
            src="/images/Genie.svg"
            priority
            alt="Logo"
            width={40}
            height={40}
          />
          <span className="text-3xl font-semibold text-gray-600">JOB GENIE</span>
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="border-black border px-1 rounded"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>
        </div>

        <nav
          className={`${
            isOpen ? "block" : "hidden"
          } md:flex md:items-center w-full md:w-auto absolute top-full left-0 md:static bg-white md:bg-transparent border-2 md:border-0 z-50`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-5 text-lg">
            <li className="border-b-2 md:border-none py-2 md:py-0">
              <Link
                href="/about"
                className={`md:p-1 md:pb-[1px] rounded md:hover:border-b-2 md:hover:border-black w-full justify-center flex md:flex-none md:inline ${
                  activeLink === "/about" ? "font-medium text-gray-950" : "font-light text-gray-600"
                }`}
                onClick={() => handleLinkClick("/about")}
              >
                About
              </Link>
            </li>
            <li className="border-b-2 md:border-none py-2 md:py-0">
              <Link
                href="/contact"
                className={`md:p-1 md:pb-[1px] rounded md:hover:border-b-2 md:hover:border-black w-full justify-center flex md:flex-none md:inline ${
                  activeLink === "/contact" ? "font-medium text-gray-950" : "font-light text-gray-600"
                }`}
                onClick={() => handleLinkClick("/contact")}
              >
                Contact
              </Link>
            </li>
            <li className="border-b-2 md:border-none py-2 md:py-0">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="justify-center flex md:flex-none md:inline"
                  onClick={() => handleLinkClick("/dashboard")}
                >
                  <Image
                    src="/images/profile-pic.png"
                    alt="profile-pic"
                    width={31}
                    height={30}
                  />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className={`md:p-1 md:pb-[1px] rounded md:hover:border-b-2 md:hover:border-black w-full justify-center flex md:flex-none md:inline ${
                    activeLink === "/login" ? "font-medium text-gray-950" : "font-light text-gray-600"
                  }`}
                  onClick={() => handleLinkClick("/login")}
                >
                  Get Started
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
    </>
  );
};

export default Header;
