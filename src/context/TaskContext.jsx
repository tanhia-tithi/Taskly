console.log("MAIN.JSX IS LOADING");
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const TaskContext = createContext(null);

export const useTasks = () => useContext(TaskContext);

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const createEmptyData = (uid) => ({
  ownerId: uid,
  tasks: [],
  coins: 0,
  history: [],
  bonusDates: [],
});

export function TaskProvider({ children }) {
  const { user } = useAuth();

  console.log("TASK PROVIDER IS RUNNING");

  const [data, setData] = useState(createEmptyData(null));
  const [loading, setLoading] = useState(true);

  // Load saved data for the logged-in user
  useEffect(() => {
    if (!user) {
      setData(createEmptyData(null));
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const saved = localStorage.getItem(`taskApp_${user.uid}`);

      if (saved) {
        const parsed = JSON.parse(saved);

        setData({
          ownerId: user.uid,
          tasks: parsed.tasks || [],
          coins: parsed.coins || 0,
          history: parsed.history || [],
          bonusDates: parsed.bonusDates || [],
        });
      } else {
        setData(createEmptyData(user.uid));
      }
    } catch (error) {
      console.error("Could not load task data:", error);
      setData(createEmptyData(user.uid));
    }

    setLoading(false);
  }, [user?.uid]);

  // Save data
  useEffect(() => {
    if (!user || data.ownerId !== user.uid || loading) return;

    localStorage.setItem(
      `taskApp_${user.uid}`,
      JSON.stringify(data)
    );
  }, [data, user, loading]);

  // Add task
  const addTask = (task) => {
    if (!user || !task.title?.trim()) return;

    const newTask = {
      id: crypto.randomUUID(),
      title: task.title.trim(),
      priority: task.priority || "normal",
      dueDate: task.dueDate || "",
      completed: false,
      rewarded: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    setData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
  };

  // Update task
  const updateTask = (id, updates) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
              title:
                updates.title !== undefined
                  ? updates.title.trim()
                  : task.title,
            }
          : task
      ),
    }));
  };

  // Delete task
  const deleteTask = (id) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== id),
    }));
  };

  // Complete or undo task
  const toggleTask = (id) => {
    setData((prev) => {
      const today = getToday();

      let newCoins = prev.coins;
      let newHistory = [...prev.history];

      const updatedTasks = prev.tasks.map((task) => {
        if (task.id !== id) return task;

        if (task.completed) {
          return {
            ...task,
            completed: false,
            completedAt: null,
          };
        }

        if (!task.rewarded) {
          const earned = task.priority === "high" ? 20 : 10;

          newCoins += earned;

          newHistory.push({
            id: crypto.randomUUID(),
            type: "earned",
            amount: earned,
            description: `Completed: ${task.title}`,
            date: new Date().toISOString(),
          });
        }

        return {
          ...task,
          completed: true,
          rewarded: true,
          completedAt: new Date().toISOString(),
        };
      });

      const completedToday = updatedTasks.filter(
        (task) =>
          task.completed &&
          task.completedAt?.slice(0, 10) === today
      ).length;

      let bonusDates = [...prev.bonusDates];

      if (
        completedToday >= 5 &&
        !bonusDates.includes(today)
      ) {
        newCoins += 50;
        bonusDates.push(today);

        newHistory.push({
          id: crypto.randomUUID(),
          type: "bonus",
          amount: 50,
          description: "Daily goal completed!",
          date: new Date().toISOString(),
        });
      }

      return {
        ...prev,
        tasks: updatedTasks,
        coins: newCoins,
        history: newHistory,
        bonusDates,
      };
    });
  };

  // Spend coins
  const spendCoins = (amount, description) => {
    setData((prev) => {
      if (
        !Number.isFinite(amount) ||
        amount <= 0 ||
        prev.coins < amount
      ) {
        return prev;
      }

      return {
        ...prev,
        coins: prev.coins - amount,
        history: [
          ...prev.history,
          {
            id: crypto.randomUUID(),
            type: "spent",
            amount,
            description,
            date: new Date().toISOString(),
          },
        ],
      };
    });
  };

  const completedTasks = useMemo(
    () => data.tasks.filter((task) => task.completed),
    [data.tasks]
  );

  const todayTasks = useMemo(
    () =>
      data.tasks.filter(
        (task) =>
          task.completedAt?.slice(0, 10) === getToday()
      ),
    [data.tasks]
  );

  const value = {
    tasks: data.tasks,
    coins: data.coins,
    history: data.history,
    completedTasks,
    todayTasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    spendCoins,
  };

  // Temporary diagnostic message
  console.log("TaskProvider is running:", value);

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}
