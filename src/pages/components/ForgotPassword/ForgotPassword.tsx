import { useState } from "react";
import { authForgotPassword } from "../../../firebase/auth";

export interface ForgotPasswordProps {
  prop?: string;
}

export function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = (email: string) => {
    authForgotPassword(email);
  };
  return (
    <div className="flex items-center w-full h-full bg-slate-200 ">
      <div className="flex flex-col w-full h-full p-10 m-auto bg-white rounded-lg sm:w-4/5 sm:h-fit md:w-3/5 lg:w-2/5 text-slate-600 drop-shadow-lg">
        <div className="flex flex-col my-auto">
          <h2 className="mb-8 text-2xl cursor-default">Forgot Password</h2>{" "}
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
          <button
            className="px-4 py-1 mt-auto text-white transition-colors duration-200 bg-blue-700 rounded-full hover:bg-blue-800"
            onClick={() => {
              handleResetPassword(email);
            }}
          >
            Send Password Reset
          </button>
        </div>
      </div>
    </div>
  );
}
