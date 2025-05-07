const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const remindersController = require("../controllers/taskReminders.controller");

/**
 * @swagger
 * tags:
 *   name: Lembretes de Tarefas
 *   description: Gerenciamento de lembretes das tarefas
 */

router.post("/", auth, remindersController.addReminder);
router.get("/task/:taskId", auth, remindersController.getRemindersByTask);
router.delete("/:id", auth, remindersController.deleteReminder);

module.exports = router;
