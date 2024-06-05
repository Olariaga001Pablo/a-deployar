"use client";
import { FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";


function Signup() {
    const [error, setError] = useState();
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
        const formData = new FormData(event.currentTarget);
        const signupResponse = await axios.post("/api/auth/signup", {
            email: formData.get("email"),
            password: formData.get("password"),
            fullname: formData.get("fullname"),
        });
        console.log(signupResponse);
        const res = await signIn("credentials", {
            email: signupResponse.data.email,
            password: formData.get("password"),
            redirect: false,
        });

        if (res?.ok) return router.push("/dashboard/profile");
        } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
            const errorMessage = error.response?.data.message;
            setError(errorMessage);
        }
        }
    };


    return (
        <div>
            <Image
                src="/home-background-op.png"
                alt="Fondo azul"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="z-0"
            />
            <div className="relative flex justify-center items-center h-screen">
                <form onSubmit={handleSubmit} className="font-semibold p-16 text-customDarkGray rounded-xl">
                    {error && <div className="bg-customRedColor rounded-md font-sans text-white p-4 mb-4 text-center border-2">{error}</div>}
                    <input
                        type="text"
                        placeholder="Account Name"
                        className="text-customDarkGray px-8 py-4 block text-center mb-4 w-full rounded-md font-sans text-base border-2"
                        name="fullname"
                    />
                    <input
                        type="email"
                        placeholder="E-Mail"
                        className="text-customDarkGray px-8 py-4 block text-center mb-4 w-full rounded-md font-sans text-base border-2"
                        name="email"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="text-customDarkGray px-8 py-4 block text-center mb-4 w-full rounded-md font-sans text-base border-2"
                        name="password"
                    />
                    <div className="space-y-4 mt-8">
                        <button className="bg-customDarkGray text-white px-9 py-4 rounded-md hover:scale-105 transition-transform duration-200 text-xl font-sans shadow-xl w-full">
                            Sign In
                        </button>
                        <div className="font-sans text-center">
                            Do you already have an account? <Link href="/" className="text-white font-bold">Log in.</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;