
import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import "./Tasks.css";

export default function Tasks() {
  const {
    tasks,
    coins,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  } = useTasks();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("normal");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    if (editingId) {
      updateTask(editingId, {
        title,
        priority,
        dueDate,
      });
      setEditingId(null);
    } else {
      addTask({ title, priority, dueDate });
    }

    setTitle("");
    setPriority("normal");
    setDueDate("");
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setPriority(task.priority);
    setDueDate(task.dueDate || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setPriority("normal");
    setDueDate("");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <main className="tasks-page">
      <section className="tasks-header">
        <div>
          <span className="tasks-eyebrow">YOUR PRODUCTIVITY SPACE</span>
          <h1>My Tasks <span>✦</span></h1>
          <p>Small steps every day lead to big achievements.</p>
        </div>

        <div className="coin-balance">
          <span>🪙</span>
          <div>
            <strong>{coins}</strong>
            <small>Available coins</small>
          </div>
        </div>
      </section>

      <section className="task-form-card">
        <h2>{editingId ? "Edit task" : "Create a new task"}</h2>
        <p>Every completed task brings you closer to a reward!</p>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="task-field task-title-field">
            <label htmlFor="task-title">Task name</label>
            <input
              id="task-title"
              type="text"
              placeholder="What do you want to accomplish?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="task-form-row">
            <div className="task-field">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="normal">Normal (+10 coins)</option>
                <option value="high">High (+20 coins)</option>
              </select>
            </div>

            <div className="task-field">
              <label htmlFor="task-date">Due date</label>
              <input
                id="task-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="task-form-actions">
            <button className="task-submit" type="submit">
              {editingId ? "Save Changes" : "+ Add Task"}
            </button>

            {editingId && (
              <button
                className="task-cancel"
                type="button"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="task-list-section">
        <div className="task-list-heading">
          <div>
            <h2>Your task list</h2>
            <p>
              {completedCount} of {tasks.length} tasks completed
            </p>
          </div>

          <div className="task-filters">
            {["all", "active", "completed"].map((item) => (
              <button
                key={item}
                className={filter === item ? "selected" : ""}
                onClick={() => setFilter(item)}
                type="button"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="empty-tasks">
            <span>📝</span>
            <h3>No tasks found</h3>
            <p>
              {tasks.length === 0
                ? "Add your first task and start earning coins!"
                : "Try selecting another filter."}
            </p>
          </div>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <article
                className={`task-item ${
                  task.completed ? "task-done" : ""
                }`}
                key={task.id}
              >
                <button
                  type="button"
                  className={`task-check ${
                    task.completed ? "checked" : ""
                  }`}
                  onClick={() => toggleTask(task.id)}
                  aria-label={
                    task.completed
                      ? "Mark task incomplete"
                      : "Complete task"
                  }
                >
                  {task.completed ? "✓" : ""}
                </button>

                <div className="task-info">
                  <h3>{task.title}</h3>
                  <div className="task-meta">
                    <span
                      className={`priority-tag ${task.priority}`}
                    >
                      {task.priority} priority
                    </span>

                    {task.dueDate && (
                      <span className="due-date">
                        📅 {task.dueDate}
                      </span>
                    )}
                  </div>
                </div>

                <div className="task-reward">
                  {task.rewarded ? (
                    <span>✓ Earned</span>
                  ) : (
                    <span>
                      +{task.priority === "high" ? 20 : 10} 🪙
                    </span>
                  )}
                </div>

                <div className="task-actions">
                  <button
                    type="button"
                    onClick={() => handleEdit(task)}
                    aria-label="Edit task"
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Delete this task?")) {
                        deleteTask(task.id);
                        if (editingId === task.id) cancelEdit();
                      }
                    }}
                    aria-label="Delete task"
                  >
                    🗑
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
