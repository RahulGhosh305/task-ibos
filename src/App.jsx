import React, { useEffect } from 'react';
import AllRoutes from './components/routers/AllRoutes';
import AuthProvider from './components/authentication/AuthContext';
import { openDatabase } from './components/authentication/IndexedDB';

const App = () => {
  // useEffect(() => {
  //   openDatabase()
  // }, [])

  return (
    <>
      <AuthProvider>
        <AllRoutes />
      </AuthProvider>
    </>
  );
};

export default App;