import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para el documento de recurso
interface Recurso {
    name: string;
    quantity: number;
}

// Interfaz para el documento de mensaje
interface Message extends Document {
    sender: mongoose.Types.ObjectId; // ID del usuario que envía el mensaje
    receiver: mongoose.Types.ObjectId; // ID del usuario que recibe el mensaje
    content: string;
    timestamp: Date;
    resources: Recurso[];
}

// Esquema para los recursos
const ResourceSchema = new Schema<Recurso>({
    name: { type: String, required: true },
    quantity: { type: Number, required: true }
});

// Esquema para los mensajes
const MessageSchema = new Schema<Message>({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    resources: [ResourceSchema]
});

export default mongoose.models.Message || mongoose.model<Message>('Message', MessageSchema);
