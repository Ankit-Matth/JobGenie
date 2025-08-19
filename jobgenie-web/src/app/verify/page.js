'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import axios from 'axios';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { data: session } = useSession();

  const [status, setStatus] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const sendEmail = async () => {
    if (!session?.user?.email) return;
    try {
      setIsLoading(true);
      setStatus('');
      setIsExpired(false);
      const res = await axios.post('/api/verify', { email: session.user.email });
      if (res.data.success) {
        setStatus('✅ Verification email sent successfully. Please check your inbox.');
        setEmailSent(true);
        setIsExpired(false);
      } else {
        setStatus(res.data.message || '❌ Failed to send email.');
      }
    } catch (err) {
      setStatus('❌ Error sending email.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async () => {
    try {
      setIsLoading(true);
      setStatus('');
      const res = await axios.get(`/api/verify?token=${token}`);
      if (res.data.success) {
        await signIn('credentials', { user: res.data.user, redirect: true, callbackUrl: '/' });
        setStatus('✅ Email verified successfully!');
        setIsVerified(true);
      } else {
        setStatus('❌ Token expired or invalid.');
        setIsExpired(true);
      }
    } catch (err) {
      setIsExpired(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-gradient-to-r from-blue-100 to-purple-100 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-lg bg-white p-6 sm:p-10 rounded-xl shadow-xl border border-gray-100">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-6 sm:mb-8 text-left">Email Verification</h2>

        {session?.user && (
          <>
            <div className="text-lg sm:text-xl mb-4 text-left">
              <h3 className="font-semibold text-gray-700">Welcome, {session.user.fullName}!</h3>
              <p className="text-gray-600 mt-1 sm:mt-2">Your email: {session.user.email}</p>
            </div>
            <p className="text-gray-600 mb-6 text-left">
              To receive personalized job alerts, recommendations, and updates from Job Genie, please verify your email address.
            </p>
          </>
        )}

        {isLoading && (
          <p className="text-blue-600 mb-4 font-medium text-center">⏳ Please wait...</p>
        )}

        {!token && !emailSent && !isLoading && (
          <button
            onClick={sendEmail}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full px-4 py-3 rounded-lg transition-all mb-6 shadow-md"
          >
            Send Verification Email
          </button>
        )}

        {token && !isVerified && !isExpired && !isLoading && !status && (
          <button
            onClick={verifyEmail}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full px-4 py-3 rounded-lg transition-all mb-6 shadow-md"
          >
            Verify Now
          </button>
        )}

        {isExpired && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-4 sm:p-6 rounded-md mb-6 shadow-md text-center">
            <p className="font-semibold">❌ This verification link has expired.</p>
            {!emailSent && (
              <button
                onClick={sendEmail}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-1/2 mx-auto text-white font-semibold px-4 py-2 rounded-lg transition-all mt-4"
              >
                Resend Verification Email
              </button>
            )}
          </div>
        )}

        {status && (
          <p
            className={`mt-3 text-base sm:text-lg text-center ${
              status.startsWith('✅') ? 'text-green-600' : status.startsWith('❌') ? 'text-red-600' : 'text-gray-700'
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
