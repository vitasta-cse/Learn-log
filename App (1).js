import React, { useEffect, useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    fetch("http://localhost:3001/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  }, []);

  const addTask = () => {
    if (taskInput.trim() === "") {
      alert("Please enter a task");
      return;
    }

    fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: taskInput }),
    })
      .then((res) => res.json())
      .then((task) => {
        setTasks([...tasks, task]);
        setTaskInput("");
      });
  };

  const completeTask = (id) => {
    fetch(`http://localhost:3001/tasks/${id}`, { method: "PUT" })
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task.id === id
              ? { ...task, completed: !task.completed }
              : task
          )
        );
      });
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:3001/tasks/${id}`, { method: "DELETE" })
      .then(() => setTasks(tasks.filter((task) => task.id !== id)));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length
    ? (completedCount / tasks.length) * 100
    : 0;

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <header style={{ background: "#4a90e2", color: "white", padding: "15px" }}>
        <h1>📚 Learn Log</h1>
        <p>Your personal study planner</p>
      </header>

      <h2>Welcome back, Student!</h2>
      <p>Today's Date: {today}</p>

      <h3>Add a Study Task</h3>
      <input
        type="text"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        placeholder="Enter your task"
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.text}
            </span>
            <button onClick={() => completeTask(task.id)}>✔</button>
            <button onClick={() => deleteTask(task.id)}>🗑</button>
          </li>
        ))}
      </ul>

      <p>
        You have completed {completedCount} of {tasks.length} tasks today.
      </p>

      <div style={{ background: "#ddd", height: "20px", width: "100%" }}>
        <div
          style={{
            background: "#4a90e2",
            height: "100%",
            width: `${progress}%`,
          }}
        ></div>
      </div>

      <footer style={{ marginTop: "20px" }}>
        © 2025 Learn Log | Built with ❤️ for students
      </footer>
    </div>
  );
}
