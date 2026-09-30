import React from "react";
import api from "../services/api";
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext.jsx";

const Login = () => {
  const { isLoggedIn, logout, login } = useContext(AuthContext);

  const testProfile = async () => {
    const response = await api.get("/api/auth/profile");

    console.log(response.data);
  };

  const handleLogout = () => {
    // console.log("token removed successfully ","token")
    // localStorage.removeItem('token')
    // setIsLoggedIn(false);
    logout();
  };
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await api.post("/api/auth/login", {
      email: form.email,
      password: form.password,
    });
    setForm({
      email: "",
      password: "",
    });
    console.log(response.data);
    console.log(response.data.token);
    login(response.data.token);
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 justify-center items-center py-10"
      >
        <input
          className="border-2 border-black text-center"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          type="text"
          placeholder="email"
        />
        <input
          className="border-2 border-black text-center"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          type="password"
          placeholder="password"
        />
        <button
          className="rounded-md px-6 py-2 bg-blue-400"
          type="button"
          onClick={testProfile}
        >
          TEST PROFILE
        </button>
        {!isLoggedIn && (
          <button className="rounded-md px-6 py-2 bg-blue-400" type="submit">
            Login
          </button>
        )}

        {isLoggedIn && (
          <button
            className="rounded-md px-6 py-2 bg-red-400"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
