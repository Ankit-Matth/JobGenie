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
        // Sign in the user automatically after verification to upadte session
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
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-xl border border-gray-100">
        <h2 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Email Verification</h2>

        {session?.user && (
          <>
            <div className="text-2xl mb-4">
              <h3 className="font-semibold text-gray-700">Welcome, {session.user.fullName}!</h3>
              <p className="text-gray-600 mt-2">Your email: {session.user.email}</p>
            </div>
            <p className="text-gray-600 mb-6">
              To receive personalized job alerts, recommendations, and updates from Job Genie, please verify your email address.
            </p>
          </>
        )}

        {isLoading && (
          <p className="text-blue-600 mb-4 font-medium">⏳ Please wait...</p>
        )}

        {/* Show "Send Verification Email" if no token and not sent */}
        {!token && !emailSent && !isLoading && (
          <button
            onClick={sendEmail}
            className="bg-blue-600 hover:bg-blue-700 w-full md:w-1/3 text-white font-semibold px-6 py-3 rounded-lg transition-all mb-6 shadow-md"
          >
            Send Verification Email
          </button>
        )}

        {/* Show "Verify Now" only when token exists and not verified */}
        {token && !isVerified && !isExpired && !isLoading && !status && (
          <button
            onClick={verifyEmail}
            className="bg-green-600 hover:bg-green-700 w-full md:w-1/3 text-white font-semibold px-6 py-3 rounded-lg transition-all mb-6 shadow-md"
          >
            Verify Now
          </button>
        )}

        {/* Expired Link + Resend Option */}
        {isExpired && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-6 rounded-md mb-6 shadow-md">
            <p className="font-semibold">❌ This verification link has expired.</p>
            {!emailSent && (
              <button
                onClick={sendEmail}
                className="bg-red-600 hover:bg-red-700 w-full md:w-1/3 text-white font-semibold px-6 py-3 rounded-lg transition-all mt-4"
              >
                Resend Verification Email
              </button>
            )}
          </div>
        )}

        {/* Status Message */}
        {status && (
          <p
            className={`mt-3 text-lg ${
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
