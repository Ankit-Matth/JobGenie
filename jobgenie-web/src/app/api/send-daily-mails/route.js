import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import UserModel from "@/models/Users";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const expressServerUrl = process.env.SCRAPER_API_URL;

export async function GET(req) {
  // Authorization check
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await connectDB();

    // Fetch only verified users who have preferredSkills not equal to "None"
    const users = await UserModel.find({
      $and: [
        { preferredSkills: { $ne: 'None' } },
        { isEmailVerified: true }
      ]
    });

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No verified users found' },
        { status: 404 }
      );
    }

    // Loop over users and send emails
    for (const user of users) {
      try {
        const response = await fetch(`${expressServerUrl}/scrape-jobs-personalized`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            preferredSkills: user.preferredSkills || '',
            preferredLocations: user.preferredLocations || ''
          }),
        });

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();

          await resend.emails.send({
            from: 'Job Genie <onboarding@resend.dev>',
            to: user.email,
            subject: 'Daily Job Alert from Job Genie ✨',
            html: `
              <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 20px; border-radius: 8px;">
                <p style="font-size: 16px; color: #374151;">
                  Hello <strong>${user.fullName}</strong>,
                </p>
                <p style="font-size: 14px; color: #4b5563;">
                  Hope you're having a great day! Here are opportunities on <strong>Job Genie</strong> according to your preferences:
                </p>
                <div>${data.scrapedJobs}</div>
                <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
                  &copy; ${new Date().getFullYear()} Job Genie. All rights reserved.
                </p>
              </div>
            `,
          });
        }
      } catch (err) {
        console.error(`Failed to send email to ${user.email}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Emails sent to ${users.length} users`,
    });

  } catch (err) {
    console.error("Daily mail error:", err);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
