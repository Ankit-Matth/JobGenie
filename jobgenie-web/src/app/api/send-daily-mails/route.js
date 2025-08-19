import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import { sendEmail } from "@/utils/mailer";
import UserModel from "@/models/Users";

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
      preferredSkills: { $ne: 'None' },
      isEmailVerified: true
    });

    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, message: 'No verified users found' }, { status: 404 });
    }

    let sentCount = 0;

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

          const jobsHtml = data.scrapedJobs
          .map(job => `
            <div style="background: #fff; padding: 10px; margin-bottom: 10px; border-radius: 6px;">
              <h3 style="margin: 0; font-size: 16px; color: #111;"><strong>${job.title}</strong></h3>
              <p style="margin: 2px 0; font-size: 14px; color: #555;">${job.company}</p>
              <p style="margin: 2px 0; font-size: 14px; color: #555;">${job.location}</p>
              <p style="margin: 2px 0; font-size: 14px; color: #555;">${job.experience}</p>
              <p style="margin: 2px 0; font-size: 12px; color: #16a34a;">Posted: ${job.posted}</p>
              <a href="${job.src}" target="_blank" style="display:inline-block; margin-top:5px; padding:5px 10px; background:#f59e0b; color:#fff; text-decoration:none; border-radius:4px;">View Details</a>
            </div>
          `).join('');


          const html = `
          <div style="max-width: 700px; margin: auto; font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://the-job-genie.vercel.app/images/logo.png" alt="JobGenie Logo" style="width: 400px" />
            </div>

            <p style="font-size: 16px; color: #374151;">Hi <strong>${user.fullName}</strong>,</p>

            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Hope you're having a great day! Here are opportunities according to your preferences:
            </p>

            <div>${jobsHtml}</div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

            <p style="font-size: 13px; text-align: center;">
              Need help? Contact us at <a href="mailto:support@jobgenie.com" style="color: #2563eb; text-decoration: none;">support@jobgenie.com</a>
            </p>

            <p style="font-size: 13px; text-align: center; margin-top: 3px;">
              &copy; ${new Date().getFullYear()} Job Genie. All rights reserved.
            </p>
          </div>
          `;

          const result = await sendEmail({ to: user.email, subject: "Daily Job Alert from Job Genie ✨", html });

          if (result.success) sentCount++;
          else console.error(`Email failed for ${user.email}:`, result.error);
        }
      } catch (err) {
        console.error(`Failed to send email to ${user.email}:`, err);
      }
    }

    return NextResponse.json({ success: true, message: `Emails sent to ${sentCount} of ${users.length} users` });

  } catch (err) {
    console.error("Daily mail error:", err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
