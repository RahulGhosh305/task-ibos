import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from './useAuth';

const PrivateRoute = ({ children }) => {
    let { isLoggedIn } = useAuth();
    let location = useLocation();
    // console.log(isLoggedIn);
    // console.log(isLoggedIn, isLoggedIn.email, isLoggedIn.emailVerified)
    // if (isLoggedIn.email && isLoggedIn.emailVerified === true) {
    //     return children;
    // }
    if (isLoggedIn.email) {
        return children;
    }
    return <Navigate to="/signin" state={{ from: location }} replace />;
};

export default PrivateRoute;