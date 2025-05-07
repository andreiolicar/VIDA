const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const collaboratorsController = require("../controllers/taskCollaborators.controller");

/**
 * @swagger
 * tags:
 *   name: Colaboradores de Listas
 *   description: Gerenciamento de colaboradores em listas de tarefas
 */

router.post("/", auth, collaboratorsController.addCollaborator);
router.get("/list/:listId", auth, collaboratorsController.getCollaboratorsByList);
router.delete("/:id", auth, collaboratorsController.removeCollaborator);

module.exports = router;
