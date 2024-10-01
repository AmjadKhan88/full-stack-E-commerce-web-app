import axios from 'axios';
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Initial user state

    // Fetch user data from API or local storage if needed
    const userData = async () => { // Make the function asynchronous
        const token = localStorage.getItem('userToken');

        if (!token) {
            // Handle missing token scenario (e.g., redirect to login)
            console.warn('Missing user token in localStorage');
            return; // Exit the function if no token is found
        }

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/userFetch/${token}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true, // Include cookies in the request
            });

            setUser(response.data.user); // Update the user state with fetched data
        } catch (error) {
            console.error('Error fetching user data:', error); // Log the error details
        }
    };

    // Memoize user to prevent unnecessary re-renders
    const memoizedUser = useMemo(() => user, [user]);

    useEffect(() => {
        userData(); // Call userData when the component mounts
    }, []); // Empty dependency array ensures it runs only once

    return (
        <UserContext.Provider value={{ user: memoizedUser, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);

export default UserProvider;
