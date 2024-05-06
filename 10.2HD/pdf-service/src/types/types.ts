import mongoose from "mongoose";

declare global {
    namespace Express {
        export interface Request {
            user?: IUser;
        }
    }
}

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
}

export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    role: UserRole;
    comparePassword: (password: string) => Promise<boolean>;
}

export type TokenPayload = {
    id: string;
    iat: number;
    exp: number;
}
