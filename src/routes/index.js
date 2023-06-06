const auth = require("./auth.routes");
const blogs = require("./blogs.routes");
const likes = require("./likes.routes");
const admin = require("./admin.routes");

module.exports = [auth, blogs, likes, admin];