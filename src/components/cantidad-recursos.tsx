import Image from "next/image";

type NewType = {
    resources: Array<{
        _id: string;
        name: "oro" | "comida" | "piedra" | "madera" | "tropas";
        quantity: number;
    }>;
};

const CantidadRecursos = ({ resources }: NewType) => {
    return (
        <div className="fixed bottom-0 text-3xl left-0 right-0 pb-4 flex justify-center">
            <ul className="text-center flex gap-5">
                {resources.map((recurso, index) => (
                    <div key={index} className={`border-2 border-customDarkGray bg-customDarkGray rounded-lg`}>
                        <div className="bg-customWhiteColor border-2 border-customDarkGray rounded-lg p-2 flex items-center">
                            {/* Renderizar la imagen según el tipo de recurso */}
                            {recurso.name === "oro" && (
                                <Image
                                    src="/icono-mina.png"
                                    alt="Icono mina"
                                    height={40}
                                    width={40}
                                    quality={100}
                                />
                            )}
                            {recurso.name === "comida" && (
                                <Image
                                    src="/icono-granja.png"
                                    alt="Icono granja"
                                    height={40}
                                    width={40}
                                    quality={100}
                                />
                            )}
                            {recurso.name === "piedra" && (
                                <Image
                                    src="/icono-cantera.png"
                                    alt="Icono cantera"
                                    height={40}
                                    width={40}
                                    quality={100}
                                />
                            )}
                            {recurso.name === "madera" && (
                                <Image
                                    src="/icono-aserradero.png"
                                    alt="Icono aserradero"
                                    height={40}
                                    width={40}
                                    quality={100}
                                />
                            )}
                            {recurso.name === "tropas" && (
                                <Image
                                    src="/icono-cuartel.png"
                                    alt="Icono cuartel"
                                    height={40}
                                    width={40}
                                    quality={100}
                                />
                            )}
                            <h1 className="text-customDarkGray font-semibold px-3 border-l-2 border-customDarkGray tracking-wider">{recurso.quantity}</h1>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default CantidadRecursos;
