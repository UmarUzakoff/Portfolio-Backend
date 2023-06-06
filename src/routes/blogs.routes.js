const { Router } = require("express");
const { blogPost, blogEdit, blogDelete, getConfirmedBlogs, personalBlogs, exactBlog } = require("../controllers/blogs.controller");
const ID_Validation = require("../middlewares/idValidation.middleware");
const { tokenMiddleware } = require("../middlewares/token.middleware");

const router = Router();

router.use(tokenMiddleware);

router.get("/blogs", getConfirmedBlogs);
router.get("/blogs/personalBlogs", personalBlogs);
router.get("/blogs/:id", ID_Validation, exactBlog);
router.post("/blogs/post", blogPost);
router.post("/blogs/edit/:id", blogEdit);
router.post("/blogs/delete/:id", ID_Validation, blogDelete);

module.exports = router;
