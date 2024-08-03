const express = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const { verifyRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verifyRole(["admin"]), createProject);
router.get("/", verifyRole(["admin", "user"]), getProjects);
router.get("/:id", verifyRole(["admin", "user"]), getProjectById);
router.put("/:id", verifyRole(["admin"]), updateProject);
router.delete("/:id", verifyRole(["admin"]), deleteProject);

module.exports = router;
