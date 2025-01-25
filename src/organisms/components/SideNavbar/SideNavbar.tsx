import { Link, useSearchParams } from "react-router-dom";
import { ToggleThemeButton } from "../../../atoms/components";
import { authSignOut } from "../../../firebase/auth";
import { useAuth } from "../../../context/authContext/Auth";

export interface SideNavbarProps {
  projects: string[];
}

export function SideNavbar({ projects }: SideNavbarProps) {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();

  return (
    <section className="flex-col hidden w-1/4 shadow-lg bg-neutral md:flex">
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
          <Link className="text-lg text-neutral-content" to="?project">
            All Projects
          </Link>
          {
            // Display the projects
            projects.map((project) => (
              <div key={project} className="pl-4">
                <Link
                  to={`?project=${project}`}
                  className={`flex items-center text-lg text-neutral-content transition-all duration-100 ${
                    project === searchParams.get("project") ? "font-bold" : ""
                  }`}
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
        className="px-4 py-2 mt-auto rounded-b-none btn btn-primary text-primary-content "
      >
        Sign Out
      </button>
    </section>
  );
}
