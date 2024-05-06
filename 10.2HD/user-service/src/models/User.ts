import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {IUser, UserRole} from "../types/types";

// Define the user schema
const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: Object.values(UserRole), default: UserRole.USER},
});

/**
 * Hash the password before saving the user model
 *
 * @param next - The next mongoose middleware function
 */
UserSchema.pre<IUser>('save', async function (next) {
    // Hash the password using bcrypt before saving the user model
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

/**
 * Compare the password sent by the user with the password in the database
 *
 * @param password - The password sent by the user
 */
UserSchema.methods.comparePassword = async function (password: string) {
    // Compare the password sent by the user with the password in the database
    return bcrypt.compare(password, this.password);
};

// Create the user model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;