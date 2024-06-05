'use client'
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Parcela from "@/components/parcela";
import CantidadRecursos from "@/components/cantidad-recursos";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Console } from "console";
import LogoutButton from "@/components/logout-button";
import MessageModal from "@/components/MessageModal";

function ProfilePage() {
    interface UserData {
        _id: string;
        email: string;
        edificios: Array<{ _id: string; name: string; level: number }>;
        recursos: Array<{
            _id: string;
            name: "oro" | "comida" | "piedra" | "madera" | "tropas";
            quantity: number;
        }>;
    }

    const { data: session, status } = useSession();
    const [user, setUser] = useState<UserData | null>(null);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const userEmail = session?.user?.email;
    const [updateTrigger, setUpdateTrigger] = useState(false);

    const userRef = useRef<UserData | null>(user);

    useEffect(() => {
        userRef.current = user;
    }, [user]);

    async function actualizar() {
        if (!userRef.current) return;
        await axios.put('/api/recursos', {
            email: userRef.current.email,
            recursos: userRef.current.recursos,
            edificios: userRef.current.edificios
        });
    }
    console.log(userRef.current?.email)
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userEmail) {
                    const response = await axios.get(`/api/recursos?email=${userEmail}`);
                    setUser(response.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [userEmail]);

    const deductResourcesForConstruction = () => {
        if (!userRef.current) return;
        const updatedRecursos = userRef.current.recursos.map(recurso => {
            switch (recurso.name) {
                case "oro":
                case "comida":
                case "piedra":
                case "madera":
                    return {...recurso, quantity: recurso.quantity - 25 };
                default:
                    return recurso;
            }
        });
        userRef.current.recursos = updatedRecursos;
        setUser({...userRef.current, recursos: updatedRecursos });
        setUpdateTrigger(true);
    };

    useEffect(() => {
        if (updateTrigger) {
            actualizar();
            setUpdateTrigger(false);
        }
    }, [updateTrigger]);

    const canAffordConstruction = (): boolean => {
        if (!userRef.current || !userRef.current.recursos) return false;

        const oroResource = userRef.current.recursos.find(recurso => recurso.name === "oro");
        const comidaResource = userRef.current.recursos.find(recurso => recurso.name === "comida");
        const piedraResource = userRef.current.recursos.find(recurso => recurso.name === "piedra");
        const maderaResource = userRef.current.recursos.find(recurso => recurso.name === "madera");

        if (!oroResource || !comidaResource || !piedraResource || !maderaResource) return false;
        return (
            oroResource.quantity >= 25 &&
            comidaResource.quantity >= 25 &&
            piedraResource.quantity >= 25 &&
            maderaResource.quantity >= 25
        );
    };

    const updateBuilding = async (pos: number, newState: string) => {
        if (!userRef.current) return;
        if (!canAffordConstruction()) return; // Check if the user can afford the construction
        deductResourcesForConstruction(); // Deduct the resources required for construction
        const updatedEdificios = [...userRef.current.edificios];
        updatedEdificios[pos] = {...updatedEdificios[pos], name: newState };
        userRef.current.edificios = updatedEdificios;
        setUser({...userRef.current, edificios: updatedEdificios });
        setUpdateTrigger(true);
        await axios.put('/api/recursos', {
            email: userRef.current.email,
            recursos: userRef.current.recursos,
            edificios: userRef.current.edificios
        });
    };

    function generarRecursosAutomaticamente() {
        if (!userRef.current) return;
        const recursosGenerados: { [key in "oro" | "comida" | "piedra" | "madera" | "tropas"]: number } = {
            oro: 0,
            comida: 0,
            piedra: 0,
            madera: 0,
            tropas: 0,
        };

        for (const edificio of userRef.current.edificios) {
            switch (edificio.name) {
                case "Granja":
                    recursosGenerados.comida += edificio.level * 10;
                    break;
                case "Mina":
                    recursosGenerados.oro += edificio.level * 10;
                    break;
                case "Aserradero":
                    recursosGenerados.madera += edificio.level * 10;
                    break;
                case "Cantera":
                    recursosGenerados.piedra += edificio.level * 10;
                    break;
                case "Cuartel":
                    recursosGenerados.tropas += edificio.level * 1;
                    break;
                case "Urbano":
                    recursosGenerados.oro += edificio.level * 5;
                    recursosGenerados.comida += edificio.level * 5;
                    recursosGenerados.madera += edificio.level * 5;
                    recursosGenerados.piedra += edificio.level * 5;
                    break;
                default:
                    break;
            }
        }

        const updatedRecursos = userRef.current.recursos.map(recurso => {
            if (recurso.name in recursosGenerados) {
                recurso.quantity += recursosGenerados[recurso.name];
            }
            return recurso;
        });

        setUser({ ...userRef.current, recursos: updatedRecursos });
        console.log(updatedRecursos);
        actualizar();
    }

    useEffect(() => {
        const intervalId = setInterval(generarRecursosAutomaticamente, 60000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <Image
                src="/background-buttons-v3.png"
                alt="Fondo azul"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="z-0"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
                <div className="absolute top-28 right-28">
                    <LogoutButton />
                </div>
                <div className="absolute top-28 left-28">
                    <button
                        className="bg-transparent cursor-pointer transition-transform duration-500 ease-in-out transform hover:scale-110 px-2"
                        onClick={() => setIsMessageModalOpen(true)}
                    >
                        <Image
                            src="/boton-buzon.png"
                            alt="Icono buzon"
                            height={40}
                            width={40}
                            quality={100}
                        />
                    </button>
                </div> 
                <MessageModal 
                userEmail = {userEmail || ''}
                isOpen = {isMessageModalOpen}
                onClose = {() => setIsMessageModalOpen(false)}
                /> 
                <div className="flex items-center flex-col gap-y-1">
                    {/* Asignar cada elemento de la lista a las parcelas */}
                    <div className="flex -mb-8">
                        {user?.edificios.slice(0, 3).map((edificio, index) => (
                            <Parcela
                                key={index}
                                estado={edificio.name}
                                pos={index}
                                canAffordConstruction={canAffordConstruction}
                                updateBuilding={updateBuilding}
                            />
                        ))}
                    </div>
                    <div className="flex">
                        {user?.edificios.slice(3, 7).map((edificio, index) => (
                            <Parcela
                                key={index}
                                estado={edificio.name}
                                pos={index + 3}
                                canAffordConstruction={canAffordConstruction}
                                updateBuilding={updateBuilding}
                            />
                        ))}
                    </div>
                    <div className="flex -my-8">
                        {user?.edificios.slice(7, 12).map((edificio, index) => (
                            <Parcela
                                key={index}
                                estado={edificio.name}
                                pos={index + 7}
                                canAffordConstruction={canAffordConstruction}
                                updateBuilding={updateBuilding}
                            />
                        ))}
                    </div>
                    <div className="flex">
                        {user?.edificios.slice(12, 16).map((edificio, index) => (
                            <Parcela
                                key={index}
                                estado={edificio.name}
                                pos={index + 12}
                                canAffordConstruction={canAffordConstruction}
                                updateBuilding={updateBuilding}
                            />
                        ))}
                    </div>
                    <div className="flex -mt-8">
                        {user?.edificios.slice(16, 19).map((edificio, index) => (
                            <Parcela
                                key={index}
                                estado={edificio.name}
                                pos={index + 16}
                                canAffordConstruction={canAffordConstruction}
                                updateBuilding={updateBuilding}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 w-full z-20">
                {user?.recursos && <CantidadRecursos resources={user.recursos} />}
            </div>
        </div>
    );
}

export default ProfilePage;
