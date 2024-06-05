import mongoose, { Document, Schema } from 'mongoose';

// Interfaz para el documento de recurso
interface Recurso {
    name: string;
    quantity: number;
}

// Interfaz para el documento de edificio
interface Edificio {
    name: string;
    level: number;
}

// Esquema para los recursos
const ResourceSchema = new Schema<Recurso>({
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 50 }
});

// Esquema para los edificios
const BuildingSchema = new Schema<Edificio>({
    name: { type: String, required: true },
    level: { type: Number, required: true, default: 1 }
});

// Interfaz para el documento de mensaje
interface Message extends Document {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    content: string;
    timestamp: Date;
    resources: Recurso[];
}

// Interfaz para el documento de usuario
interface User extends Document {
    fullname: string;
    email: string;
    password: string;
    recursos: Recurso[];
    edificios: Edificio[];
    messages: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<User>({
    fullname: {
        type: String,
        required: [true, "fullname is required"],
        minLength: [3, "fullname must be at least 3 characters"],
        maxLength: [20, "fullname must be at most 20 characters"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [
            /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
            "Email is invalid",
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
    },
    recursos: [ResourceSchema],
    edificios: [BuildingSchema],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]  // Añadir el campo de mensajes
});

// Recursos y edificios constantes (vacíos por defecto)
const constantResources: Recurso[] = [
    { name: 'oro', quantity: 50 },
    { name: 'comida', quantity: 50 },
    { name: 'piedra', quantity: 50 },
    { name: 'madera', quantity: 50 },
    { name: 'tropas', quantity: 0 }
];

const constantBuildings: Edificio[] = Array(19).fill({ name: 'Vacio', level: 1 });
constantBuildings[9] = { name: 'Urbano', level: 1 };

// Antes de guardar el usuario, asigna los recursos y edificios constantes
UserSchema.pre<User>('save', function (next) {
    this.recursos = constantResources.map(resource => ({ ...resource }));
    this.edificios = constantBuildings.map(building => ({ ...building }));
    next();
});

export default mongoose.models.User || mongoose.model<User>('User', UserSchema);
