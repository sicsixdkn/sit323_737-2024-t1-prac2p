import mongoose from "mongoose";
import {IUser, UserRole} from "../types/types";

// Define the user schema
const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: Object.values(UserRole), default: UserRole.USER},
});

// Create the user model
const User = mongoose.model<IUser>("User", UserSchema);

export default User;