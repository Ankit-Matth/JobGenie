import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/auth';
import { compare } from 'bcryptjs';
import connectDB from '@/utils/dbConfig';
import UserModel from "@/models/Users";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        await connectDB();

        const user = await UserModel.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 }
            );
        }

        const isPasswordMatched = await compare(password, user.password);

        if (!isPasswordMatched) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 }
            );
        }

        await signIn("credentials", {
          user: JSON.stringify(user),
          redirect: false,
        });

        return NextResponse.json(
            { success: true, message: "User validated successfully.", user },
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
