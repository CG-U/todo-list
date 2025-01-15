import { TasksPanel } from "../../../atoms/components";
// import { NavBar } from "../../../atoms/components";

export interface HomeProps {
  prop?: string;
}

export function Home() {
  return (
    <div className="h-full bg-gray-100">
      <div className="flex p-4 overflow-scroll">
        <TasksPanel />
      </div>
    </div>
  );
}
