import { createContext } from "react";
import useAuthFunctions from "./useAuthFunctions";

export const AuthContext = createContext({})


const AuthProvider = ({ children }) => {
    const authValues = useAuthFunctions()
    // console.log(authValues)
    return <AuthContext.Provider value={authValues}>
        {children}
    </AuthContext.Provider>
}
export default AuthProvider;