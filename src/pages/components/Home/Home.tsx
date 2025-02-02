import {
  MobileNavBar,
  SideNavbar,
  TasksPanel,
} from "../../../organisms/components";
import { useState } from "react";

export interface HomeProps {
  prop?: string;
}

export function Home() {
  const [projects, setProjects] = useState<string[]>([]);

  const handleExistingProjects = (projects: string[]) => {
    setProjects(projects);
  };

  return (
    <div className="flex flex-col h-screen md:flex-row ">
      <SideNavbar projects={projects} />
      <MobileNavBar projects={projects} />
      <div className="flex-1 w-full h-full p-4 overflow-scroll md:2/3">
        <TasksPanel
          handleExistingProjects={handleExistingProjects}
          projects={projects}
        />
      </div>
    </div>
  );
}
