// backend/src/routes/appointments.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware"); 
const appointmentController = require("../controllers/appointment.controller");

router.use(authMiddleware);

router.get("/", appointmentController.getAll);
router.post("/", appointmentController.create);
router.put("/:id", appointmentController.update);
router.delete("/:id", appointmentController.remove);

module.exports = router;
