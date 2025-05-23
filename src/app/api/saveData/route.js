import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import UserModel from '@/models/Users';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { email, fullName, preferences } = body;

    const updateData = {};

    if (fullName) {
      updateData.fullName = fullName;
    }

    if (preferences) {
      const { roles, locations, companies } = preferences;

      if (roles) updateData.preferredRoles = roles;
      if (locations) updateData.preferredLocations = locations;
      if (companies) updateData.preferredCompanies = companies;
    }
    
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    const user = await UserModel.findOne({ email });

    return NextResponse.json({ message: 'User updated successfully.', user: JSON.stringify(user)  }, { status: 200 });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal Server Error.' }, { status: 500 });
  }
}
