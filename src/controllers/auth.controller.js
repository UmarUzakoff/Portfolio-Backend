const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
const Io = require("../utils/Io");
const Users = new Io("src/database/users.json");
const User = require("../models/User");

//------------------------------------------------------LOGIN

//POSTMAN: POST , http://localhost:4567/auth/login , {"username": "Eshmat","password": "007"}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await Users.read();

    //Finding a username and Comparing Hash Values
    const findUser = users.find((user) => user.username === username);
    if (!findUser) {
      return res
        .status(404)
        .json({ message: "Incorrect username or password!" });
    }
    const comparePassword = await bcrypt.compare(password, findUser.password);
    if (!comparePassword) {
      return res
        .status(404)
        .json({ message: "Incorrect username or password!" });
    }
    //TOKEN
    const token = jwt.sign({ id: findUser.id });
    res.cookie("token", token, { maxAge: 86400000 });
    res.status(200).json({ message: "Successfully loggen in!", token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------------------------------------------REGISTER

//POSTMAN: POST , http://localhost:4567/auth/register , {"username": "Eshmat","password": "007"}

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await Users.read();

    //Finding a username and Hashing password
    const findUser = users.find((user) => user.username === username);
    if (findUser) {
      return res.status(403).json({ message: "User already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    //ID
    const id = uuid();

    //NEWUSER
    const newUser = new User(id, username, hashedPassword);
    const data = users.length ? [...users, newUser] : [newUser];
    Users.write(data);

    //TOKEN
    const token = jwt.sign({ id: newUser.id });
    res.cookie("token", token, { maxAge: 86400000 });
    res.status(201).json({ message: "Successfully registered!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
