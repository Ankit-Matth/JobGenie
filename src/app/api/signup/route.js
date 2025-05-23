import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import UserModel from '@/models/Users';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();
        
        await connectDB();

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new UserModel({
            fullName: name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Error while registering new user." }, { status: 500 });
    }
}
