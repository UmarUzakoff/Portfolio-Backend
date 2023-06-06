const { Router } = require("express");
const { confirmBlogs, adminGetAllBlogs } = require("../controllers/admin.controller");
const ID_Validation = require("../middlewares/idValidation.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");
const { tokenMiddleware } = require("../middlewares/token.middleware");

const router = Router();

router.use(tokenMiddleware);
router.use(isAdmin);

router.get("/blogs/admin/allBlogs", adminGetAllBlogs);
router.post("/blogs/admin/confirmation/:id",ID_Validation, confirmBlogs);

module.exports = router;