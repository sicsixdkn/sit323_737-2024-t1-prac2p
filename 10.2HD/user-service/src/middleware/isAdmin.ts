import {Request, Response, NextFunction} from 'express';

/**
 * Middleware to check if the user is an admin
 *
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function
 */
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the user from the request object (set by the authenticateUser middleware)
        const user = req.user;

        // If the user is found and is an admin, call the next middleware
        if (user && user.role === 'admin') {
            next();
        } else {
            // If the user is not an admin, return an error
            return res.status(403).json({message: 'User is not an admin'});
        }
    } catch (error) {
        return res.status(401).json({message: 'Authentication failed'});
    }
};

export {isAdmin};