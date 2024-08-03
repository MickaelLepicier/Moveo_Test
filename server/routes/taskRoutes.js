const express = require("express");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const { verifyRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verifyRole(["admin", "user"]), createTask);
router.get("/", verifyRole(["admin", "user"]), getTasks);
router.get("/:id", verifyRole(["admin", "user"]), getTaskById);
router.put("/:id", verifyRole(["admin", "user"]), updateTask);
router.delete("/:id", verifyRole(["admin", "user"]), deleteTask);

module.exports = router;
