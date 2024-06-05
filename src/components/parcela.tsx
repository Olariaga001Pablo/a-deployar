import Image from "next/image";
import { useState, useEffect } from "react";

interface ParcelaProps {
    estado: string;
    pos: number;
    // updateResources: (c: { type: string, amount: number }) => void;
    canAffordConstruction: () => boolean;
    updateBuilding: (pos: number, newState: string) => void;
}

export default function Parcela({ estado, pos, canAffordConstruction, updateBuilding }: ParcelaProps) {
    const [Estado, setEstado] = useState(estado);
    const [fondo, setFondo] = useState<string>("/wooden-empty-v2.png");
    const [open, setOpen] = useState(false);
    let css = open ? "z-10 bg-white text-black absolute" : "hidden";
    useEffect(() => {
        switch (Estado) {
            case "Vacio":
                setFondo("/wooden-empty-v2.png");
                break;
            case "Urbano":
                setFondo("/wooden-towncenter-v2.png");
                break;
            case "Granja":
                setFondo("/wooden-farm-v2.png");
                break;
            case "Aserradero":
                setFondo("/wooden-lumberjack-v2.png");
                break;
            case "Cantera":
                setFondo("/wooden-stone-v2.png");
                break;
            case "Mina":
                setFondo("/wooden-gold-v2.png");
                break;
            case "Cuartel":
                setFondo("/wooden-barracks-v2.png");
                break;
            default:
                setFondo("");
        }
    }, [Estado]);

    const handleClick = () => {
        if (Estado !== "Urbano") {
            setOpen(true);
        }
    };

    const handleConstruction = (newState: string) => {
        if (canAffordConstruction()) {
            setEstado(newState);
            updateBuilding(pos, newState);
            setOpen(false);
        } else {
            alert("No tienes suficientes recursos para construir este edificio.");
        }
    };

    const handleGranja = () => handleConstruction("Granja");
    const handleMina = () => handleConstruction("Mina");
    const handleCantera = () => handleConstruction("Cantera");
    const handleAserradero = () => handleConstruction("Aserradero");
    const handleCuartel = () => handleConstruction("Cuartel");

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-customDarkGray bg-opacity-50 z-50 flex items-center justify-center font-sans">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-customYellow border-4 border-customDarkGray p-8 px-10 rounded-lg shadow-lg">
                            <h3 className="text-center text-customDarkGray font-bold mb-4 text-xl">EDIFICIOS</h3>
                            <ul className="text-center">
                                <li className="bg-customFarmColor border-2 border-customDarkGray rounded p-2 mb-2 flex items-center">
                                    <Image
                                        src="/icono-granja.png"
                                        alt="Icono granja"
                                        height={40}
                                        width={40}
                                        quality={100}
                                    />
                                    <button className="text-customDarkGray text-lg font-semibold" onClick={handleGranja}>Granja</button>
                                </li>
                                <li className="bg-customMineColor border-2 border-customDarkGray rounded p-2 mb-2 flex items-center">
                                    <Image
                                        src="/icono-mina.png"
                                        alt="Icono mina"
                                        height={40}
                                        width={40}
                                        quality={100}
                                    />
                                    <button className="text-customDarkGray text-lg font-semibold" onClick={handleMina}>Mina</button>
                                </li>
                                <li className="bg-customQuarryColor border-2 border-customDarkGray rounded p-2 mb-2 flex items-center">
                                    <Image
                                        src="/icono-cantera.png"
                                        alt="Icono cantera"
                                        height={40}
                                        width={40}
                                        quality={100}
                                    />
                                    <button className="text-customDarkGray text-lg font-semibold" onClick={handleCantera}>Cantera</button>
                                </li>
                                <li className="bg-customSawmillColor border-2 border-customDarkGray rounded p-2 mb-2 flex items-center">
                                    <Image
                                        src="/icono-aserradero.png"
                                        alt="Icono aserradero"
                                        height={40}
                                        width={40}
                                        quality={100}
                                    />
                                    <button className="text-customDarkGray text-lg font-semibold" onClick={handleAserradero}>Aserradero</button>
                                </li>
                                <li className="bg-customBarracksColor border-2 border-customDarkGray rounded p-2 mb-2 flex items-center">
                                    <Image
                                        src="/icono-cuartel.png"
                                        alt="Icono cuartel"
                                        height={40}
                                        width={40}
                                        quality={100}
                                    />
                                    <button className="text-customDarkGray text-lg font-semibold" onClick={handleCuartel}>Cuartel</button>
                                </li>
                                <button className="text-customDarkGray text-lg font-bold mt-4" onClick={() => setOpen(false)}>X</button>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            <div className="cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 -mx-0.5" onClick={handleClick}>
                <Image
                    src={fondo}
                    alt={`Parcela ${pos}`}
                    width={100}
                    height={100}
                />
            </div>
        </>
    );
}
