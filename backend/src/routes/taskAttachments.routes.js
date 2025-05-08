const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const attachmentsController = require("../controllers/taskAttachments.controller");

/**
 * @swagger
 * tags:
 *   name: Anexos de Tarefas
 *   description: Gerenciamento de anexos das tarefas
 */

router.post("/", auth, attachmentsController.addAttachment);
router.get("/task/:taskId", auth, attachmentsController.getAttachmentsByTask);
router.delete("/:id", auth, attachmentsController.deleteAttachment);

module.exports = router;
