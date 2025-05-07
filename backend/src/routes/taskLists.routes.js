const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const taskListsController = require("../controllers/taskLists.controller");

/**
 * @swagger
 * tags:
 *   name: Listas de Tarefas
 *   description: Gerenciamento de listas de tarefas do usuário
 */

router.post('/', auth, taskListsController.createTaskList);
router.get("/user/:userId", auth, taskListsController.getAllTaskLists);
router.get("/:id", auth, taskListsController.getTaskListById);
router.patch("/:id", auth, taskListsController.updateTaskList);
router.delete("/:id", auth, taskListsController.deleteTaskList);

module.exports = router;
