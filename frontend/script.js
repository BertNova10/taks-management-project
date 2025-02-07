document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const taskForm = document.getElementById("taskForm");

  // Handle login
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("http://localhost:2584/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("token", data.token);
          window.location.href = "dashboard.html";
        } else {
          alert(data.message || "Login failed");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  }

  // Handle registration
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("http://localhost:2584/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
          alert("Registration successful! Please login.");
          window.location.href = "login.html";
        } else {
          alert(data.message || "Registration failed");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  }

  // Check for token and redirect if not logged in
  const token = localStorage.getItem("token");
  if (!token && window.location.pathname !== "/login.html") {
    window.location.href = "login.html";
  }

  // Fetch and display tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:2584/api/tasks", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const tasks = await response.json();
      const taskList = document.getElementById("taskList");
      if (taskList) {
        taskList.innerHTML = tasks.map(task => `
          <li>
            <strong>${task.title}</strong>
            <p>${task.description}</p>
          </li>
        `).join('');
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Add a new task
  if (taskForm) {
    taskForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;

      try {
        const response = await fetch("http://localhost:2584/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description }),
        });

        if (response.ok) {
          fetchTasks(); // Refresh task list
          taskForm.reset(); // Clear form
        } else {
          alert("Failed to add task");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  }

  // Fetch tasks on page load (if the task list exists)
  if (document.getElementById("taskList")) {
    fetchTasks();
  }
});
