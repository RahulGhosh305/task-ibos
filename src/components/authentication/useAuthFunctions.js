import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addUser, getUser } from './IndexedDB';


const useAuthFunctions = () => {
    const [isLoggedIn, SetIsLoggedIn] = useState({})

    const location = useLocation();
    const navigate = useNavigate()
    const from = location.state?.from?.pathname || '/';


    //* Sign Up (Create) New User By (Email/Password)
    const Register = async (name, email, bio, password, imageURL) => {
        const user = { name, email, bio, password, imageURL }

        try {
            await addUser(user);
            alert('Registration successful!');
            navigate("/signin")
        } catch (error) {
            console.error('Registration error:', error);
        }
    }


    //* SignIn (Login) Authentication By (Email/Password)
    const signIn = async (email, password) => {
        const user = { email, password }

        try {
            const storedUser = await getUser(user.email);
            if (storedUser && storedUser.password === user.password) {
                alert('Login successful!');
                SetIsLoggedIn(storedUser);
                navigate(from, { replace: true });
            } else {
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    }


    //* Sign Out
    const SignOut = () => {
        try {
            SetIsLoggedIn({})
        } catch (error) {
            console.log("Sign Out Error Are :", error);
        }
    }

    return {
        isLoggedIn,
        SignOut,
        Register,
        signIn
    }
}
export default useAuthFunctions