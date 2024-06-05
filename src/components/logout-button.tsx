import React from 'react';
import Image from 'next/image';

const LogoutButton = () => {
    const handleLogout = () => {
        console.log('Logout button clicked'); // Verifica si se está llamando correctamente al hacer clic
        window.location.href = 'http://localhost:3000/api/auth/signout';
    };

    return (
        <button
        className="bg-transparent cursor-pointer transition-transform duration-500 ease-in-out transform hover:scale-110 px-0.5"
        onClick={handleLogout}
        >
            <Image
                src="/boton-logout.png"
                alt="Icono logout"
                height={40}
                width={40}
                quality={100}
            />
        </button>
    );
};

export default LogoutButton;
