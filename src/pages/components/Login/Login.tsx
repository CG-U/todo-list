import React, { useEffect } from "react";
import { useState } from "react";
import {
  authSignInWithEmailAndPassword,
  authSignInWithGoogle,
} from "../../../firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext/Auth";
import googleIcon from "./../../../assets/google-icon.png";

export interface LoginProps {
  prop?: string;
}

export function Login() {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    // Handle login logic here
    authSignInWithEmailAndPassword(email, password);
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    authSignInWithGoogle();
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (userLoggedIn) {
      navigate("/");
    }
  }, [userLoggedIn]);

  return (
    <div
      className="flex items-center justify-center h-full bg-slate-200 "
      data-theme="nord"
    >
      <div className="w-4/5 lg:w-3/5 h-[65%] hidden md:grid grid-cols-2 rounded-lg shadow-lg overflow-clip transition-all duration-100">
        <div className="flex flex-col p-10 bg-white text-slate-600">
          <div className="flex flex-col flex-1">
            <span className="flex items-center justify-between mb-8">
              <h2 className="text-2xl cursor-default ">Sign In</h2>{" "}
              <img
                className="w-8 h-8 p-1 border rounded-full border-slate-500 "
                role="button"
                src={googleIcon} // Use the imported Google icon
                alt="google-logo"
                onClick={handleGoogleLogin}
              />
            </span>
            <div>
              <label className="flex flex-col mb-4 font-bold ">
                Email:
                <input
                  type="email"
                  className="mt-2 input input-primary input-sm {} "
                  value={email}
                  onChange={handleEmailChange}
                />
              </label>
            </div>
            <div>
              <label className="flex flex-col font-bold">
                Password:
                <input
                  type="password"
                  className="mt-2 input input-primary input-sm"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </label>
            </div>
            <button className="mt-auto btn btn-primary" onClick={handleLogin}>
              Login
            </button>
            <Link to={"/forgot-password"} className="mx-auto mt-2 text-sm">
              Forgot Password
            </Link>
          </div>
        </div>
        <div className="flex flex-col p-10 bg-primary text-primary-content">
          <div className="flex flex-col items-center justify-center h-full m-auto space-y-4 text-center w-fit">
            <h1 className="text-2xl font-black">Welcome To Listify</h1>
            <span className="flex justify-center space-x-1 ">
              <p>A To Do List App by</p>
              <p>
                <span className="text-xs text-orange-600">dot</span>
                <span className="font-bold">Ced</span>
              </p>
            </span>
            <Link to={"/sign-up"} className="btn btn-primary-content">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
