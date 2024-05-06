import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import {TokenPayload} from "../types/types";

/**
 * Middleware to authenticate the user using the JWT token
 *
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function
 */
const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    // Get the JWT token from the authorization header
    const token = req.headers.authorization?.split(" ")[1];

    // If there is no token, return an error
    if (!token) {
        return res.status(401).json({message: "Authentication failed"});
    }

    try {
        // Decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
        // Find the user by the id in the token
        const user = await User.findById(decoded.id);

        // If the user is not found, return an error
        if (!user) {
            return res.status(401).json({message: "Authentication failed"});
        }

        // Set the user on the request object and call the next middleware
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({message: "Authentication failed"});
    }
};

export {authenticateUser};

