import React, {useContext, useState} from 'react';
import {Button, Container, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import UserContext from '../contexts/UserContext';

const {appConfig} = window;

function RegisterForm() {
    // State variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Other hooks
    const navigate = useNavigate();
    const userContext = useContext(UserContext);

    // Event handler for form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent the default form submission
        event.preventDefault();

        // Reset error messages
        setEmailError('');
        setPasswordError('');

        // Perform validation
        let isValid = true;
        if (!email.includes('@')) {
            setEmailError('Invalid email address');
            isValid = false;
        }
        if (password.length == 0) {
            setPasswordError('Please enter a password');
            isValid = false;
        }
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            isValid = false;
        }

        // If the form is not valid, return early
        if (!isValid) {
            return;
        }

        // Send a request to the API to register and log in the user
        const response = await fetch(`${appConfig.USER_SERVICE_API_URI}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        });

        // Parse the JSON response
        const data = await response.json();

        // If the response is successful, set the user in the context and navigate to the home page
        if (response.ok) {
            if (!data.token || !data.user) {
                // If the response is missing the token or user, display an error message
                setEmailError("An error occurred");
                return;
            }
            const {token, user} = data;
            localStorage.setItem('token', token);
            userContext?.setUser(user);
            navigate('/');
        } else {
            // If the response is not successful, display an error message
            setEmailError("Invalid email or password");
            setPasswordError("Invalid email or password");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Typography component="h1" variant="h5">
                Register
            </Typography>
            <form onSubmit={handleSubmit} noValidate>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!emailError}
                    helperText={emailError}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!passwordError}
                    helperText={passwordError}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    autoComplete="current-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{mt: 3, mb: 2}}
                >
                    Register
                </Button>
            </form>
        </Container>
    );
}

export default RegisterForm;