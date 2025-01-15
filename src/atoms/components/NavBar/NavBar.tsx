import { authSignOut } from "../../../firebase/auth";

export interface NavBarProps {
  prop?: string;
}

export function NavBar() {
  const handleSignOut = () => {
    authSignOut();
  };
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between p-4 bg-gray-800">
      <p className="w-6 h-6 text-center bg-white rounded-full ">U</p>
      <button onClick={handleSignOut}>Sign Out </button>
    </div>
  );
}
