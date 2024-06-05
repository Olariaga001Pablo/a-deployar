"use client";
import { FormEvent, useState } from "react";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function Signin() {
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
        });

        if (res?.error) setError(res.error as string);

        if (res?.ok) return router.push("/dashboard/profile");

        console.log(res)
    };

    return (
        <div className="text-3xl tracking-wider">
            <Image
                src="/home-background-op.png"
                alt="Fondo azul"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="z-0"
            />
            <div className="relative flex justify-center items-center h-screen">
                    <form
                        onSubmit={handleSubmit}
                        className="font-semibold p-16 text-customDarkGray rounded-xl"
                    >
                        {error && (
                            <div className="bg-customRedColor rounded-md font-sans text-center text-white p-4 mb-4 text-2xl border-2">
                                {error}
                            </div>
                        )}
    
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
                            <button className="bg-customDarkGray text-white px-9 py-4 rounded-md hover:scale-105 transition-transform duration-200 text-xl font-sans shadow-2xl w-full">
                                Login
                            </button>
                            <div className="font-sans text-center text-base">
                                Don't have an account yet? <Link href="/register" className="text-white font-bold">Sing Up.</Link>
                            </div>
                        </div>
                    </form>
                </div>
        </div>
    );
    
}

export default Signin;