import { Link, useSearchParams } from "react-router-dom";
import { Icon, ToggleThemeButton } from "../../../atoms/components";
import { authSignOut } from "../../../firebase/auth";
import { useAuth } from "../../../context/authContext/Auth";
import { useState } from "react";

export interface MobileNavBarProps {
  projects: string[];
}

export function MobileNavBar({ projects }: MobileNavBarProps) {
  const { currentUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCloseMenu = () => setMenuOpen(false);

  return (
    <section className="flex justify-between w-full px-4 py-3 shadow-lg bg-primary md:hidden">
      <p className="font-bold cursor-default text-primary-content">
        {currentUser?.displayName}
      </p>
      <h2 className="flex space-x-1 text-xl bg-primary text-primary-content">
        <ToggleThemeButton className="w-5 h-5" />
        <Icon
          iconName="menu"
          className="text-primary-content"
          role="button"
          onClick={() => setMenuOpen(!menuOpen)}
        />
      </h2>

      {menuOpen && (
        <div
          className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleCloseMenu}
        >
          <div
            className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform ${
              menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <PopoutMenu projects={projects} onClose={handleCloseMenu} />
          </div>
        </div>
      )}
    </section>
  );
}

function PopoutMenu({
  projects,
  onClose,
}: MobileNavBarProps & { onClose: () => void }) {
  const [searchParams] = useSearchParams();
  return (
    <div className="flex flex-col flex-1 h-full overflow-y-auto bg-primary text-primary-content">
      <div className="p-4 ">
        <div>
          <Link to="?find=today" className="text-lg " onClick={onClose}>
            Today
          </Link>
        </div>

        <div>
          <Link to="?find=completed" className="text-lg " onClick={onClose}>
            Completed
          </Link>
        </div>
        <div>
          <Link className="text-lg " to="?project" onClick={onClose}>
            All Projects
          </Link>
          {
            // Display the projects
            projects.map((project) => (
              <div key={project} className="pl-4">
                <Link
                  to={`?project=${project}`}
                  className={`flex items-center text-lg  transition-all duration-100 ${
                    project === searchParams.get("project") ? "font-bold" : ""
                  }`}
                  onClick={onClose}
                >
                  {project}
                </Link>
              </div>
            ))
          }
        </div>
      </div>

      <button
        onClick={() => {
          authSignOut();
          onClose();
        }}
        className="px-4 py-2 mt-auto rounded-b-none btn"
      >
        Sign Out
      </button>
    </div>
  );
}
