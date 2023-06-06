const { Router } = require("express");
const { like } = require("../controllers/likes.controller");
const ID_Validation = require("../middlewares/idValidation.middleware");
const { tokenMiddleware } = require("../middlewares/token.middleware");

const router = Router();

router.use(tokenMiddleware);

router.post("/blogs/like/:id", ID_Validation, like);

module.exports = router;
