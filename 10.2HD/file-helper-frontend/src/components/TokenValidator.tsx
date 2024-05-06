import {useContext, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import UserContext from "../contexts/UserContext.tsx";

const {appConfig} = window;

// TokenValidator component which is run on every page load to ensure the JWT token is valid
function TokenValidator() {
    // Other hooks
    const navigate = useNavigate();
    const userContext = useContext(UserContext);
    const location = useLocation();

    // Effect hook to validate the token
    useEffect(() => {
        const validateToken = async () => {
            try {
                // Get the token from local storage
                const token = localStorage.getItem("token");

                // If there is a token, send a request to the API to validate it
                if (token) {
                    const response = await fetch(`${appConfig.USER_SERVICE_API_URI}/users/validate`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    // Parse the JSON response
                    const data = await response.json();

                    // If the response is successful and the user email is present, set the user in the context
                    if (response.ok && data.user.email) {
                        userContext?.setUser({email: data.user.email});
                    } else {
                        // If the response is not successful, clear the token from local storage and reset the user context
                        userContext?.setUser(null);
                        localStorage.removeItem("token");
                        // Then navigate to the login page
                        navigate("/login");
                    }
                } else {
                    // If there is no token, clear the user context
                    userContext?.setUser(null);
                    // Then navigate to the login page unless we are on the register page
                    if (location.pathname !== "/register")
                        navigate("/login");
                }
            } catch (error) {
                // If there is an error, clear the token from local storage and reset the user context
                userContext?.setUser(null);
                localStorage.removeItem("token");
                // Then navigate to the login page
                navigate("/login");
            }
        };

        // Call the validateToken function
        validateToken();
    }, [location.pathname]);

    return null;
}

export default TokenValidator;