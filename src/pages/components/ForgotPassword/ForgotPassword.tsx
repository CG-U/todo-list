import { useState } from "react";
import { authForgotPassword } from "../../../firebase/auth";
import { Icon } from "../../../atoms/components";
import { Link } from "react-router-dom";

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
    <div
      className="flex items-center w-full h-full bg-slate-200 "
      data-theme="nord"
    >
      <div className="flex flex-col w-full h-full p-10 m-auto bg-white rounded-lg sm:w-4/5 sm:h-fit md:w-3/5 lg:w-2/5 text-slate-600 drop-shadow-lg">
        <div className="flex flex-col my-auto">
          <h2 className="flex items-center mb-8 text-2xl cursor-default">
            <Link to="/login">
              <Icon iconName="chevron_left" className="text-2xl" />
            </Link>
            Forgot Password
          </h2>{" "}
          <div>
            <label className="flex flex-col mb-4 font-bold">
              Email:
              <input
                type="email"
                className=" input input-primary input-sm"
                value={email}
                onChange={handleEmailChange}
              />
            </label>
          </div>
          <button
            className="text-white btn btn-primary"
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
