import React from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <div>
      {isLoggedIn ? (
        <>
          <button className='rounded-md px-6 py-2 bg-teal-400 m-5'>Dashboard</button>
          <button className='rounded-md px-6 py-2 bg-red-400' onClick={logout}>Logout</button>
        </>
      ) : (
        <button className='rounded-md px-6 py-2 bg-blue-400'>Login</button>
      )}
    </div>
  );
};

export default Navbar;
