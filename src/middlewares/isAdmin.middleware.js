const Io = require("../utils/Io");
const Users = new Io("src/database/users.json");

const isAdmin = async(req, res, next) => {
  try {
    const users = await Users.read();
    //------IS_ADMIN?
    const admin = users.find(
      (user) => user.role === "admin" && user.id === req.verifiedUser
    );
    if (!admin) {
      return res
        .status(403)
        .json({ message: "This route is only available for admins!" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = isAdmin;
