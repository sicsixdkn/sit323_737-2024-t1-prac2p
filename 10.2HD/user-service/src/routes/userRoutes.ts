import express from 'express';
import User from '../models/User';
import {isAdmin} from "../middleware/isAdmin";
import {authenticateUser} from "../middleware/authenticateUser";
import jwt from 'jsonwebtoken';

const router = express.Router();

/**
 * Generate a JWT token
 *
 * @param id - The user ID
 */
const generateToken = (id: string) => {
    return jwt.sign({id}, process.env.JWT_SECRET!, {expiresIn: '1h'});
};

// POST /api/users/register
router.post('/register', async (req, res) => {
    // Get the email and password from the request body
    const {email, password} = req.body;

    // Find a user with the same email
    const userExists = await User.findOne({email});

    // If the user exists, return an error
    if (userExists) {
        return res.status(400).json({message: 'User already exists'});
    }

    // Create a new user
    const user = new User({
        email,
        password,
    });

    // Save the user to the database
    await user.save();

    // Generate a JWT token
    const token = generateToken(user._id);

    // Return the token and user
    return res.status(201).json({token, user});
});

// POST /api/users/login
router.post('/login', async (req, res) => {
    // Get the email and password from the request body
    const {email, password} = req.body;

    // Find the user by email
    const user = await User.findOne({email});

    // If the user is not found or the password is incorrect, return an error
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({message: 'Invalid email or password'});
    }

    // Generate a JWT token
    const token = generateToken(user._id);

    // Return the token and user
    return res.json({token, user});
});

// DELETE /api/users/:id
router.delete('/:id', authenticateUser, isAdmin, async (req, res) => {
    // Find the user by ID and delete it
    const user = await User.findByIdAndDelete(req.params.id);

    // If the user is not found, return an error
    if (!user) {
        return res.status(404).json({message: 'User not found'});
    }

    // Return a success message
    return res.json({message: 'User removed'});
});

// GET /api/users/validate
router.get('/validate', authenticateUser, async (req, res) => {
    // Return the user if the token is valid
    return res.json({user: req.user});
});

export default router;