import { useState } from "react";
import { authCreateUserWithEmailAndPassword } from "../../../firebase/auth";

export interface SignUpProps {
  prop?: string;
}

export function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };

  const handleSignUp = (
    email: string,
    password: string,
    displayName: string
  ) => {
    if (email && password && displayName) {
      authCreateUserWithEmailAndPassword(email, password, displayName);
    } else {
      if (!email && !password && !displayName) {
        alert("Email, Password, and Display Name are required.");
      } else if (!email) {
        alert("Email is required.");
      } else if (!password) {
        alert("Password is required.");
      } else if (!displayName) {
        alert("Display Name is required.");
      }
    }
  };

  return (
    <div className="flex items-center w-full h-full bg-slate-200 ">
      <div className="flex flex-col w-full h-full p-10 m-auto bg-white rounded-lg sm:w-4/5 sm:h-fit md:w-3/5 lg:w-2/5 text-slate-600 drop-shadow-lg">
        <div className="flex flex-col my-auto">
          <h2 className="mb-4 text-2xl cursor-default">Sign Up</h2>{" "}
          <div>
            <label className="flex flex-col mb-4 font-bold">
              Display Name:
              <input
                type="text"
                className="p-1 mt-2 rounded-lg bg-slate-400"
                value={displayName}
                onChange={handleDisplayNameChange}
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col mb-4 font-bold">
              Email:
              <input
                type="email"
                className="p-1 mt-2 rounded-lg bg-slate-400"
                value={email}
                onChange={handleEmailChange}
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col mb-4 font-bold">
              Password:
              <input
                type="password"
                className="p-1 my-2 rounded-lg bg-slate-400"
                value={password}
                onChange={handlePasswordChange}
              />
            </label>
          </div>
          <button
            className="px-4 py-1 mt-auto text-white transition-colors duration-200 bg-blue-700 rounded-full hover:bg-blue-800"
            onClick={() => {
              handleSignUp(email, password, displayName);
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
