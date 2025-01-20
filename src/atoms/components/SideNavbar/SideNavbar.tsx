import { Link } from "react-router-dom";
import { ToggleThemeButton } from "../ToggleThemeButton";
import { authSignOut } from "../../../firebase/auth";
import { useAuth } from "../../../context/authContext/Auth";

export interface SideNavbarProps {
  projects: string[];
}

export function SideNavbar({ projects }: SideNavbarProps) {
  const { currentUser } = useAuth();

  return (
    <section className="flex flex-col w-1/4 shadow-lg bg-neutral">
      <h2 className="flex justify-between px-2 py-4 text-xl font-bold bg-primary text-primary-content">
        {currentUser?.displayName}
        <ToggleThemeButton className="w-5 h-5" />
      </h2>

      <div className="flex-1 p-2 overflow-y-auto">
        <div>
          <Link to="?find=today" className="text-lg text-neutral-content">
            Today
          </Link>
        </div>

        <div>
          <Link to="?find=completed" className="text-lg text-neutral-content">
            Completed
          </Link>
        </div>
        <div>
          <h2 className="text-lg text-neutral-content">Projects</h2>
          {
            // Display the projects
            projects.map((project) => (
              <div key={project} className="pl-4">
                <Link
                  to={`?project=${project}`}
                  className="text-lg text-neutral-content"
                >
                  {project}
                </Link>
              </div>
            ))
          }
        </div>
      </div>

      <button
        onClick={authSignOut}
        className="px-4 py-2 mt-auto rounded-b-none btn btn-secondary text-neutral"
      >
        Sign Out
      </button>
    </section>
  );
}
