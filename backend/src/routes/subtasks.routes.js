const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const subtasksController = require("../controllers/subtasks.controller");

/**
 * @swagger
 * tags:
 *   name: Subtasks
 *   description: Gerenciamento de subtarefas relacionadas às tarefas
 */

router.post("/", auth, subtasksController.createSubtask);

router.get("/task/:taskId", auth, subtasksController.getSubtasksByTask);

router.patch("/:id", auth, subtasksController.updateSubtask);

router.delete("/:id", auth, subtasksController.deleteSubtask);

module.exports = router;
