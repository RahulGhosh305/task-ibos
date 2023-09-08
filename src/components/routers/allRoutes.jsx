import React from 'react';
import { Routes, Route } from "react-router-dom";

import Home from '../homepage/home';
import About from '../aboutpage/about';
import SignIn from '../authentication/signIn';
import SignUp from '../authentication/signup';
import PrivateRoute from '../authentication/PrivateRoute';
import AddTask from '../addTask/addTask';
import MakeTeam from '../makeTeam/makeTeam';

const AllRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} /> */}
            <Route path="/about" element={<PrivateRoute> <About /> </PrivateRoute>} />
            {/* <Route path="/addTask" element={<PrivateRoute> <AddTask /> </PrivateRoute>} /> */}
            <Route path="/addTask" element={<AddTask />} />
            <Route path="/makeTeam" element={<MakeTeam />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
        </Routes>
    );
};

export default AllRoutes;