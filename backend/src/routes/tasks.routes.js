const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const tasksController = require("../controllers/tasks.controller");

router.post("/:userId", auth, tasksController.createTask);
router.get("/list/:listId", auth, tasksController.getTasksByList);
router.get("/:id", auth, tasksController.getTaskById);
router.patch("/:id", auth, tasksController.updateTask);
router.delete("/:id", auth, tasksController.deleteTask);

router.get("/kanban/:listId", auth, tasksController.getTasksKanbanByList);
router.get("/calendar/:userId", auth, tasksController.getTasksCalendarByUser);
router.get('/user/:userId', auth, tasksController.getTasksByUser);

module.exports = router;
