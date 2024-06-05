import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB();

    const {email} = await request.json();    
    const userFound = await User.findOne({ email });

    const user = new User({
      email,
    });
    console.log("hasta aca llego")

    // const savedUser = await user.save();
    // console.log(savedUser);

    return NextResponse.json(
      {
        // fullname,
        email,
        // createdAt: savedUser.createdAt,
        // updatedAt: savedUser.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
    return NextResponse.error();
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Extraer solo los campos necesarios
    const { _id, recursos, edificios } = user;

    // Crear un nuevo objeto con solo los campos deseados
    const userResponse = { _id, recursos, edificios, email};

    return NextResponse.json(userResponse, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred" },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, recursos, edificios } = body;
    console.log(body);

    if (!email || !recursos || !edificios) {
      return NextResponse.json(
        { message: "Email, recursos, and edificios are required" },
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate(
      { email },
      { recursos, edificios },
      { new: true } // Esta opción devuelve el documento actualizado
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Extraer solo los campos necesarios
    const { _id, recursos: updatedRecursos, edificios: updatedEdificios } = user;

    // Crear un nuevo objeto con solo los campos deseados
    const userResponse = { _id, recursos: updatedRecursos, edificios: updatedEdificios };

    return NextResponse.json(userResponse, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred" },
      { status: 500 }
    );
  }
}