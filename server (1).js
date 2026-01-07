const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Temporary storage (acts like database)
let tasks = [];

// Test route
app.get("/", (req, res) => {
  res.send("Learn Log Backend is running 🚀");
});

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Add new task
app.post("/tasks", (req, res) => {
  const task = {
    id: Date.now(),
    text: req.body.text,
    completed: false
  };
  tasks.push(task);
  res.json(task);
});

// Mark task completed
app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.map(task =>
    task.id === taskId ? { ...task, completed: true } : task
  );
  res.json({ message: "Task updated" });
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== taskId);
  res.json({ message: "Task deleted" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
