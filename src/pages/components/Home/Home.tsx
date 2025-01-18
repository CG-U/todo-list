import { TasksPanel, ToggleThemeButton } from "../../../atoms/components";
import { authSignOut } from "../../../firebase/auth";
import { useAuth } from "../../../context/authContext/Auth";

export interface HomeProps {
  prop?: string;
}

export function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="flex h-full ">
      <section className="flex flex-col w-1/4 h-screen shadow-md bg-neutral">
        <h2 className="flex justify-between px-2 py-4 text-xl font-bold bg-primary text-primary-content">
          {currentUser?.displayName}
          <ToggleThemeButton className="w-5 h-5" />
        </h2>
        <button
          onClick={authSignOut}
          className="px-4 py-2 mt-auto rounded-b-none btn btn-secondary text-neutral"
        >
          Sign Out
        </button>
      </section>
      <div className="flex p-4 overflow-scroll">
        <TasksPanel />
      </div>
    </div>
  );
}
