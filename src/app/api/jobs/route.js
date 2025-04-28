import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import JobsModel from '@/models/JobListings';

export async function GET(request) {
  try {
    await connectDB();

    const allJobs = await JobsModel.find();

    if (!allJobs || allJobs.length === 0) {
      return NextResponse.json(
        { success: false, message: "No jobs found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, jobs: allJobs },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Something went wrong", error: err.message },
      { status: 500 }
    );
  }
}
