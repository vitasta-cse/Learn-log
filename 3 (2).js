let taskCount = 0;

// Show today's date
function showDate() {
  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  document.getElementById("dateDisplay").textContent =
    today.toLocaleDateString("en-US", options);
}
showDate();

// Fetch tasks from backend when page loads
function loadTasks() {
  fetch("http://localhost:3000/tasks")
    .then(response => response.json())
    .then(tasks => {
      tasks.forEach(task => displayTask(task));
      updateProgress();
    });
}
loadTasks();

// Add Task (Send to Backend)
function addTask() {
  const taskInput = document.getElementById("taskInput");

  if (taskInput.value.trim() === "") {
    alert("Please enter a task!");
    return;
  }

  fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: taskInput.value })
  })
    .then(response => response.json())
    .then(task => {
      displayTask(task);
      taskInput.value = "";
      updateProgress();
    });
}

// Display task on UI
function displayTask(task) {
  const taskList = document.getElementById("taskList");
  const li = document.createElement("li");
  li.textContent = task.text;

  if (task.completed) {
    li.classList.add("completed");
  }

  // Complete button
  const completeBtn = document.createElement("button");
  completeBtn.textContent = "✔";
  completeBtn.onclick = function () {
    fetch(`http://localhost:3000/tasks/${task.id}`, {
      method: "PUT"
    }).then(() => {
      li.classList.toggle("completed");
      updateProgress();
    });
  };

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑";
  deleteBtn.onclick = function () {
    fetch(`http://localhost:3000/tasks/${task.id}`, {
      method: "DELETE"
    }).then(() => {
      li.remove();
      updateProgress();
    });
  };

  li.appendChild(completeBtn);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// Update progress bar
function updateProgress() {
  const tasks = document.querySelectorAll("#taskList li");
  const completedTasks = document.querySelectorAll("#taskList li.completed");

  taskCount = completedTasks.length;

  document.getElementById("progressText").textContent =
    `You have completed ${taskCount} of ${tasks.length} tasks today.`;

  const progressPercent = tasks.length
    ? (taskCount / tasks.length) * 100
    : 0;

  document.getElementById("progressFill").style.width =
    progressPercent + "%";
}
