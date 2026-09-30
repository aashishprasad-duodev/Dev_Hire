import { createContext, useState } from "react";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")

    
  );

  const login =(token)=>{
    localStorage.setItem("token", token );
    setIsLoggedIn(true);
  }

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
};

  return (
    <AuthContext.Provider value={{ isLoggedIn, login , logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
