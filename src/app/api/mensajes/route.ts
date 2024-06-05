import { connectDB } from "@/libs/mongodb";
import Message from "@/models/mensajes";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    await connectDB();
    try {
        const messages = await Message.find().populate("sender receiver");
        
        return NextResponse.json({ data: messages }, { status: 200 });

    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await connectDB();
    try {
        const { senderId, receiverId, content, resources } = await request.json();
        
        // Crear un nuevo mensaje utilizando el esquema de mensaje
        const message = new Message({
            sender: senderId,
            receiver: receiverId,
            content,
            timestamp: new Date(),
            resources
        });

        const savedMessage = await message.save();

        // Añadir el mensaje al usuario receptor
        await User.findByIdAndUpdate(receiverId, {
            $push: { messages: savedMessage._id }
        });

        return NextResponse.json({ message: "Message created", data: savedMessage }, { status: 201 });
    } catch (error) {
        console.error("Error saving message:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
