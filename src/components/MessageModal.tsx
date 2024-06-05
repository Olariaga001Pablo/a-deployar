// components/MessageModal.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Message {
    senderName: string;
    receiverEmail: string;
    content: string;
    timestamp: Date;
    resources: { name: string, quantity: number }[];
}

interface User {
    _id: string;
    email: string;
    messages: Message[];
}

interface MessageModalProps {
    userEmail: string;
    isOpen: boolean;
    onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ userEmail, isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [receiverEmail, setReceiverEmail] = useState('');
    const [content, setContent] = useState('');
    const [resources, setResources] = useState({ oro: 0, comida: 0, piedra: 0, madera: 0 });

    useEffect(() => {
        if (userEmail) {
            const fetchMessages = async () => {
                try {
                    const response = await axios.get(`/api/messages?email=${userEmail}`);
                    setMessages(response.data.messages);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };
            fetchMessages();
        }
    }, [userEmail]);

    const handleSendMessage = async () => {
        try {
            await axios.post('/api/messages', {
                senderEmail: userEmail,
                receiverEmail,
                content,
                resources: [
                    { name: 'oro', quantity: resources.oro },
                    { name: 'comida', quantity: resources.comida },
                    { name: 'piedra', quantity: resources.piedra },
                    { name: 'madera', quantity: resources.madera }
                ]
            });
            setReceiverEmail('');
            setContent('');
            setResources({ oro: 0, comida: 0, piedra: 0, madera: 0 });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-customDarkGray bg-opacity-50 z-50 flex items-center justify-center font-sans">
            <div className="bg-customYellow border-4 border-customDarkGray p-8 px-10 rounded-lg shadow-lg text-customDarkGray relative">
                <div>
                    <div className="mb-4">
                        <h2 className="text-lg font-bold">Mensajes Recibidos</h2>
                        <ul>
                            {messages.map((msg, index) => (
                                <li key={index} className="border-b border-gray-200 py-2">
                                    <p><strong>De:</strong> {msg.senderName}</p>
                                    <p>{msg.content}</p>
                                    <p><strong>Recursos:</strong> {msg.resources.map(res => `${res.name}: ${res.quantity}`).join(', ')}</p>
                                    <p><em>{new Date(msg.timestamp).toLocaleString()}</em></p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <h2 className="text-lg font-bold text-center p-2">Enviar Mensaje</h2>
                    <input
                        type="email"
                        placeholder="Email del destinatario"
                        value={receiverEmail}
                        onChange={(e) => setReceiverEmail(e.target.value)}
                        className="w-full p-2 border border-customDarkGray rounded mb-2"
                    />
                    <textarea
                        placeholder="Mensaje"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 border border-customDarkGray rounded mb-2"
                    />
                    <div className="flex justify-between mb-4">
                        {['oro', 'comida', 'piedra', 'madera'].map((resource) => (
                            <input
                                key={resource}
                                type="number"
                                placeholder={`Cantidad de ${resource}`}
                                value={resources[resource as keyof typeof resources]}
                                onChange={(e) => setResources({ ...resources, [resource]: Number(e.target.value) })}
                                className="w-1/4 p-2 border border-customDarkGray rounded mb-2 mx-1"
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleSendMessage}
                        className="w-full bg-customDarkGray text-white p-2 rounded"
                    >
                        Enviar
                    </button>
                    <button
                    className="w-full bottom-2 font-bold text-customDarkGray py-1 px-4 rounded mt-4"
                    onClick={onClose}
                    >
                    X
                </button>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;
