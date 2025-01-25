import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../../../context/authContext/Auth";
import { db } from "../../../firebase/firebase";
import moment from "moment";
import { useEffect, useLayoutEffect, useState } from "react";
import trashIcon from "../../../assets/trash.svg";
import { useSearchParams } from "react-router-dom";
import { Icon } from "../../../atoms/components";

export type Task = {
  id: string;
  title: string;
  description: string;
  isFinished: boolean;
  createdAt: string;
  completedAt: string;
  userId: string; // Should be auto set on firestore
  project?: string;
  deadline?: string;
};

export interface TasksPanelProps {
  handleExistingProjects: (projects: string[]) => void;
}

export function TasksPanel({ handleExistingProjects }: TasksPanelProps) {
  const { currentUser } = useAuth();

  // TODO: Create a simple to do list app that saves actions in firestore such as adding a task, finishing a task, removing a task

  // Load the tasks from firestore that matches the user ID

  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const handleQuickRemoveTask = (taskId: string) => {
    setUserTasks((prev) => prev.filter((task) => task.id !== taskId));
  };
  const [loading, setLoading] = useState<boolean>(false);
  const handleQuickCompletedTask = (taskId: string) => {
    setUserTasks((prev) => {
      return prev.map((task) =>
        task.id === taskId ? { ...task, isFinished: true } : task
      );
    });
  };

  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log(searchParams.get("find"));
  }, [searchParams.get("find")]);

  const fetchTasks = async () => {
    setLoading(true);
    if (currentUser) {
      const q = query(
        collection(db, "tasks"),
        where("userId", "==", currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const tasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ ...doc.data(), id: doc.id } as Task);
      });

      setUserTasks(tasks);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [currentUser]);

  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);

  const project = searchParams.get("project");
  const filter = searchParams.get("find");
  useLayoutEffect(() => {
    setShowCompleted(false);
    setShowOverdue(false);

    const filteredTasks = userTasks.filter((task) => {
      if (filter === "today") {
        return moment(task.deadline).isSame(moment(), "day");
      } else if (filter === "projects") {
        return task.project;
      } else if (filter === "completed") {
        return task.isFinished;
      } else {
        return true;
      }
    });

    const completed = filteredTasks.filter(
      (task) =>
        task.isFinished && (!project || task.project?.toLowerCase() === project)
    );
    const pending = filteredTasks.filter(
      (task) =>
        !task.isFinished &&
        (!project || task.project?.toLowerCase() === project)
    );

    const overdueTasks = pending.filter((task) =>
      moment(task.deadline).isBefore(moment())
    );

    setCompletedTasks(
      completed.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    );
    setPendingTasks(
      pending
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .filter((task) => !moment(task.deadline).isBefore(moment()))
    );
    setOverdueTasks(
      overdueTasks.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    );

    handleExistingProjects(
      Array.from(
        new Set(
          userTasks
            .map((task) => task.project?.toLowerCase())
            .filter((project) => project !== undefined)
        )
      ) as string[]
    );

    switch (filter) {
      case "today":
        setPendingTasks(
          pending.filter((task) =>
            moment(task.deadline).isSame(moment(), "day")
          )
        );
        setShowPending(true);
        setCompletedTasks(
          completed.filter((task) =>
            moment(task.deadline).isSame(moment(), "day")
          )
        );
        break;
      case "projects":
        setPendingTasks(pending.filter((task) => task.project));
        break;
      case "completed":
        setPendingTasks(pending.filter((task) => task.isFinished));
        setShowCompleted(true);
        break;
      default:
        break;
    }
  }, [userTasks, project, filter]);

  // const handleRefetchTask = () => {
  //   fetchTasks();
  // };

  const addNewTask = (task: Task) => {
    setUserTasks((prev) => [...prev, task]);
  };

  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [showOverdue, setShowOverdue] = useState<boolean>(false);
  const [showPending, setShowPending] = useState<boolean>(true);

  return (
    <div className="flex flex-col items-center w-full overflow-y-scroll h-fit ">
      <section className="flex flex-col justify-center w-full space-y-2 overflow-x-hidden ">
        {pendingTasks.length > 0 && (
          <button
            className="flex items-center mr-auto text-xl font-black "
            onClick={() => setShowPending((prev) => !prev)}
          >
            Pending Tasks {project ? "for " + project : ""}
            <Icon
              iconName="chevron_right"
              className={`w-5 h-5 transform duration-150 ml-2 ${
                showPending ? "rotate-90" : ""
              }`}
            />
          </button>
        )}

        {showPending && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading && pendingTasks.length === 0 ? (
              <span className="loading loading-dots">Loading...</span>
            ) : null}
            {pendingTasks.length === 0 &&
              !loading &&
              filter !== "completed" && <span>No Tasks Due Today</span>}
            {pendingTasks.map((task) => (
              <div className="w-full h-full ">
                <Task
                  task={task}
                  handleQuickRemoveTask={handleQuickRemoveTask}
                  handleQuickCompletedTask={handleQuickCompletedTask}
                  key={task.id}
                />
              </div>
            ))}
          </div>
        )}

        {overdueTasks.length > 0 && (
          <button
            className="flex items-center mr-auto text-xl font-black "
            onClick={() => setShowOverdue((prev) => !prev)}
          >
            Overdue Tasks{" "}
            <Icon
              iconName="chevron_right"
              className={`w-5 h-5 transform duration-150 ml-2 ${
                showOverdue ? "rotate-90" : ""
              }`}
            />
          </button>
        )}

        {showOverdue && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading && overdueTasks.length === 0 ? (
              <span className="loading loading-dots">Loading...</span>
            ) : null}
            {overdueTasks.map((task) => (
              <div className="w-full h-full" key={task.id}>
                <Task
                  task={task}
                  handleQuickRemoveTask={handleQuickRemoveTask}
                  handleQuickCompletedTask={handleQuickCompletedTask}
                />
              </div>
            ))}
          </div>
        )}

        {completedTasks.length > 0 && (
          <button
            className="flex items-center mr-auto text-xl font-black "
            onClick={() => setShowCompleted((prev) => !prev)}
          >
            Completed Tasks{" "}
            <Icon
              iconName="chevron_right"
              className={`w-5 h-5 transform duration-150 ml-2 ${
                showCompleted ? "rotate-90" : ""
              }`}
            />
          </button>
        )}

        {showCompleted && (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {loading && completedTasks.length === 0 ? (
                <span className="loading loading-dots">Loading...</span>
              ) : null}
              {completedTasks.map((task) => (
                <div className="w-full h-full" key={task.id}>
                  <Task
                    task={task}
                    handleQuickRemoveTask={handleQuickRemoveTask}
                    handleQuickCompletedTask={handleQuickCompletedTask}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <AddTask addNewTask={addNewTask} />
    </div>
  );
}

function Task({
  task,
  handleQuickRemoveTask,
  handleQuickCompletedTask,
}: {
  task: Task;
  handleQuickRemoveTask: (taskId: string) => void;
  handleQuickCompletedTask: (taskId: string) => void;
}) {
  const handleDeleteTask = () => {
    const deleteTask = async (taskId: string) => {
      try {
        await deleteDoc(doc(db, "tasks", taskId));
        console.log("Document successfully deleted!");
      } catch (e) {
        console.error("Error removing document: ", e);
      }
    };

    deleteTask(task.id);
    handleQuickRemoveTask(task.id);
  };

  const handleCompleteTask = () => {
    const completeTask = async (taskId: string) => {
      try {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, {
          isFinished: true,
          completedAt: moment().toString(),
        });
        console.log("Task marked as completed!");

        handleQuickCompletedTask(task.id);
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    };

    completeTask(task.id);
  };

  return (
    <div
      className={`w-full max-w-screen-sm p-4 mx-auto  rounded shadow-md space-y-2 h-full flex flex-col bg-neutral text-neutral-content `}
    >
      <div className="flex-1">
        <h2 className="font-bold">{task.title}</h2>
        <div className="text-xs ">
          {task.isFinished && (
            <p>Completed: {moment(task.completedAt).format("LLL")}</p>
          )}
          <p>Due on: {moment(task.deadline).format("LLL")}</p>
        </div>

        <p className="">{task.description}</p>
      </div>
      <div className="flex justify-end w-full mt-auto space-x-2 ">
        {!task.isFinished && (
          <button
            className="px-2 py-1 rounded-md btn btn-success"
            onClick={handleCompleteTask}
          >
            Complete
          </button>
        )}
        <button
          className="px-2 py-1 rounded-md btn btn-error"
          onClick={handleDeleteTask}
        >
          <img
            src={trashIcon}
            alt="delete"
            className="object-contain w-8 h-8 p-1 text-white fill-white"
          />
        </button>
      </div>
    </div>
  );
}

function AddTask({ addNewTask }: { addNewTask: (task: Task) => void }) {
  const { currentUser } = useAuth();

  const [newTask, setNewTask] = useState<Task>({
    description: "",
    title: "",
    isFinished: false,
    userId: currentUser ? currentUser.uid : "",
    createdAt: moment().toString(),
    deadline: "",
    completedAt: moment().toString(),
    id: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const closeModal = () => {
    const modal = document.getElementById(
      "create-task-modal"
    ) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  const handleCreateNewTask = async (task: Task) => {
    console.log(task);
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        ...task,
      });

      // instead of refetching the tasks, we can just add the new task to the list

      addNewTask({
        ...task,
        id: docRef.id,
      });

      setNewTask({
        ...newTask,
        title: "",
        description: "",
        id: "",
      });
      setLoading(false);
      closeModal();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      {/* Open the modal using document.getElementById('create-task-modal').showModal() method */}
      <button
        className="fixed mr-4 bottom-4 right-4 btn btn-primary"
        onClick={() => {
          const modal = document.getElementById(
            "create-task-modal"
          ) as HTMLDialogElement;
          if (modal) {
            modal.showModal();
          }
        }}
      >
        Add Task
      </button>
      <dialog id="create-task-modal" className="h-screen modal ">
        <div className=" modal-box">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateNewTask(newTask);
            }}
            className="flex flex-col space-y-4"
          >
            <label className="flex flex-col font-bold ">
              Title
              <input
                type="text"
                className="rounded-lg input input-sm input-primary"
                placeholder="Title"
                value={newTask.title}
                onChange={(e) => {
                  setNewTask({ ...newTask, title: e.target.value });
                }}
              />
            </label>
            <label className="flex flex-col font-bold ">
              Description
              <textarea
                // type="text"
                className="rounded-lg textarea textarea-primary"
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => {
                  setNewTask({ ...newTask, description: e.target.value });
                }}
              />
            </label>
            <label className="flex flex-col font-bold ">
              Project
              <input
                type="text"
                className="rounded-lg input input-sm input-primary"
                placeholder="Project"
                value={newTask.project}
                onChange={(e) => {
                  setNewTask({ ...newTask, project: e.target.value });
                }}
              />
            </label>
            <label className="flex flex-col font-bold ">
              Deadline
              <input
                type="date"
                className="rounded-lg input input-sm input-primary"
                value={newTask.deadline}
                onChange={(e) => {
                  setNewTask({ ...newTask, deadline: e.target.value });
                }}
              />
            </label>

            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <button type="submit" className="btn btn-primary">
                Add Task
              </button>
            )}
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
