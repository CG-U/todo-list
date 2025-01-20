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

  useLayoutEffect(() => {
    const completed = userTasks.filter((task) => task.isFinished);
    const pending = userTasks.filter((task) => !task.isFinished);
    const filter = searchParams.get("find");

    setCompletedTasks(
      completed.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    );
    setPendingTasks(
      pending.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
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
        break;
      default:
        break;
    }
  }, [userTasks]);

  // const handleRefetchTask = () => {
  //   fetchTasks();
  // };

  const addNewTask = (task: Task) => {
    setUserTasks((prev) => [...prev, task]);
  };

  return (
    <div className="flex flex-col items-center w-full h-full overflow-y-scroll ">
      <section className="flex flex-col justify-center w-full space-y-2 overflow-x-hidden ">
        <h1 className="text-xl font-black">
          Your Tasks {project ? "for " + project : ""}
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading && pendingTasks.length === 0 ? (
            <span className="loading loading-dots">Loading...</span>
          ) : null}
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

        {/* <h1 className="text-xl font-black">Completed Tasks</h1>
        <div className="flex flex-col gap-4 overflow-y-scroll md:flex-wrap md:flex-row">
          {loading && completedTasks.length === 0 ? (
            <span className="loading loading-dots">Loading...</span>
          ) : null}
          {completedTasks.map((task) => (
            <div className="w-fit">
              <Task
                task={task}
                handleQuickRemoveTask={handleQuickRemoveTask}
                handleQuickCompletedTask={handleQuickCompletedTask}
                key={task.id}
              />
            </div>
          ))}
        </div> */}
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
      className={`w-full max-w-screen-sm p-4 mx-auto bg-neutral text-neutral-content rounded shadow-md space-y-2 h-full flex flex-col`}
    >
      <div className="flex-1">
        <h2 className="font-bold text-primary">{task.title}</h2>
        {/* <p>Is Task completed: {task.isFinished ? "YES" : "NO"}</p> */}

        {/* <div className="text-xs text-neutral-content">
          <p>Created: {moment(task.createdAt).format("LLL")}</p>
          {task.isFinished && (
            <p>Completed: {moment(task.completedAt).format("LLL")}</p>
          )}
        </div> */}
        <div className="text-xs text-neutral-content">
          {task.isFinished && (
            <p>Completed: {moment(task.completedAt).format("LLL")}</p>
          )}
          <p>Due on: {moment(task.deadline).format("LLL")}</p>
        </div>

        <p>{task.description}</p>
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
        className="fixed mr-4 bottom-4 right-4 btn"
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
