const { Router } = require("express");
const {
  postMessage,
  adminLogin,
  getMessages,
  postProject,
  getProjects,
  exactProject,
  deleteProject,
  editProject,
} = require("../controllers/blogs.controller");
const ID_Validation = require("../middlewares/idValidation.middleware");
const { tokenMiddleware } = require("../middlewares/token.middleware");

const router = Router();

router.post("/comments", postMessage);
router.post("/admin/login", adminLogin);
router.get("/admin/dashboard/messages", tokenMiddleware, getMessages);
router.post("/admin/dashboard/postProject", tokenMiddleware, postProject);
router.delete("/admin/deleteProject/:id", tokenMiddleware, ID_Validation, deleteProject);
router.put("/admin/editProject/:id", tokenMiddleware, ID_Validation, editProject);
router.get("/projects", getProjects);
router.get("/projects/:id", ID_Validation, exactProject);

module.exports = router;
