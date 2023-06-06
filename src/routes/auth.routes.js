const { Router } = require("express");
const { login, register } = require("../controllers/auth.controller");
const validation = require("../middlewares/authValidation");

const router = Router();

router.post("/auth/login", validation, login);
router.post("/auth/register", validation, register);

module.exports = router;
