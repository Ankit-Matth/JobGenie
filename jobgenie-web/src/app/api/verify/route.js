import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import { sendEmail } from '@/utils/mailer';
import UserModel from "@/models/Users";
import crypto from 'crypto';

export async function POST(request) {
  await connectDB();
  const { email } = await request.json();

  const user = await UserModel.findOne({ email });
  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 10 * 60 * 1000; // 10 mins

  user.emailVerificationToken = token;
  user.emailTokenExpires = new Date(expires);
  await user.save();

  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;

  const html = `
      <div style="max-width: 700px; margin: auto; font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://the-job-genie.vercel.app/images/logo.png" alt="JobGenie Logo" style="width: 400px" />
        </div>

        <p style="font-size: 16px; color: #374151;">Hi <strong>${user.fullName}</strong>,</p>

        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          Thank you for joining us. To receive personalized job alerts, recommendations, and updates from <strong>Job Genie</strong>, please verify your email address by clicking the link below.
        </p>

        <div style="margin: 20px 0;">
          <a href="${verifyUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; font-weight: 600; text-decoration: none; border-radius: 8px;">
            Verify Email
          </a>
        </div>

        <p style="font-size: 15px; color: #6b7280; line-height: 1.5;">
          This verification link will expire in <strong>10 minutes</strong>. If you didn’t request this, you can safely ignore it.
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

        <p style="font-size: 13px; text-align: center;">
          Need help? Contact us at <a href="mailto:support@jobgenie.com" style="color: #2563eb; text-decoration: none;">support@jobgenie.com</a>
        </p>

        <p style="font-size: 13px; text-align: center; margin-top: 3px;">
          &copy; ${new Date().getFullYear()} Job Genie. All rights reserved.
        </p>
      </div>
      `
  const result = await sendEmail({ to: email, subject: "Verify Your Email", html });

  if (result.success) return NextResponse.json({ success: true });
  else return NextResponse.json({ success: false, message: 'Email failed', error: result.error }, { status: 500 });
}

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token missing' }, { status: 400 });
  }

  const user = await UserModel.findOne({
    emailVerificationToken: token,
    emailTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 400 });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailTokenExpires = undefined;
  await user.save();

  return NextResponse.json({ success: true, message: 'Email verified successfully', user: JSON.stringify(user) });
}
