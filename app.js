import express from "express";
import fs from "fs/promises";
const app = express();
const port = process.env.PORT || 80;

// Middleware
app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");

    next();
  });

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// Route / to ./index.html
app.use(express.static("build"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/build/index.html`);
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await fs.readFile("./tasks.json", "utf-8");
    res.send(JSON.parse(tasks));
  } catch (err) {
    console.log(err);
  }
});

// Get single task
app.get("/tasks/:id", async (req, res) => {
  try {
    const currentTasks = JSON.parse(await fs.readFile("./tasks.json", "utf-8"));

    const task = currentTasks.find((task) => task.id == req.params.id);

    if (!task) {
      res.status(404).send("Task id " + req.params.id + " not found.");
    }

    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create task
app.post("/tasks", async (req, res) => {
  try {
    console.log("Req-body:" + req.body);
    const currentTasks = JSON.parse(await fs.readFile("./tasks.json", "utf-8"));

    let newTaskId = 0;
    if (currentTasks && currentTasks.length > 0) {
      newTaskId = currentTasks.reduce(
        (maxId, currentElement) =>
          currentElement.id > maxId ? currentElement.id : maxId,
        0
      );
      newTaskId++;
    }

    const newTask = { id: newTaskId, ...req.body };
    const newList = currentTasks ? [...currentTasks, newTask] : [newTask];

    await fs.writeFile("./tasks.json", JSON.stringify(newList));

    res.send(newTask);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update task
app.put("/tasks/:id", async (req, res) => {
  try {
    const currentTasks = JSON.parse(await fs.readFile("./tasks.json", "utf-8"));

    if (currentTasks.length == 0) {
      res.status(404).send("No tasks found.");
    } else {
      const newList = currentTasks.map((task) => {
        if (task.id == req.params.id) {
          return { ...task, ...req.body };
        }
        return task;
      });

      await fs.writeFile("./tasks.json", JSON.stringify(newList));

      res.send(req.params.id);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const currentTasks = JSON.parse(await fs.readFile("./tasks.json", "utf-8"));
    if (currentTasks.length == 0) {
      res.status(404).send("No tasks found.");
    } else {
      const newList = currentTasks.filter((task) => task.id != req.params.id);
      await fs.writeFile("./tasks.json", JSON.stringify(newList));
      res.send("Task id " + req.params.id + " deleted.");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
