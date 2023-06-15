const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
const Joi = require("joi");
const Io = require("../utils/Io");
const Messages = new Io("src/database/messages.json");
const Message = require("../models/Message");
const Projects = new Io("src/database/projects.json");
const Project = require("../models/Project");
const Admins = new Io("src/database/admins.json");

exports.postMessage = async (req, res) => {
  try {
    const messages = await Messages.read();
    const { username, email, comment } = req.body;
    //VALIDATION
    const schema = Joi.object({
      username: Joi.string().alphanum().required(),
      email: Joi.string().email().required(),
      comment: Joi.string().required(),
    });

    const { error } = schema.validate({ username, email, comment });
    if (error) {
      return res.status(403).json({ error: error.message });
    }
    //---ID
    const id = uuid();

    //---NEWBLOG
    const newMessage = new Message(id, username, email, comment);

    const data = messages.length ? [...messages, newMessage] : [newMessage];
    Messages.write(data);
    res.status(201).json({
      message: {
        uz: "Xabar yuborildi! ",
        en: "Got Your Message 😉",
        ru: "Отправлено!",
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admins = await Admins.read();

    //VALIDATION
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate({ email, password });
    if (error) {
      return res.status(403).json({ error: error.message });
    }

    //Finding a username and Comparing Hash Values
    const findUser = admins.find((user) => user.email === email);
    if (!findUser) {
      return res.status(404).json({ error: "Incorrect email or password!" });
    }
    const comparePassword = await bcrypt.compare(password, findUser.password);
    if (!comparePassword) {
      return res.status(404).json({ error: "Incorrect email or password!" });
    }
    //TOKEN
    const token = jwt.sign({ password: findUser.password });
    res.status(200).json({
      message: {
        uz: "Xush kelibsiz!",
        en: "Welcome Back!",
        ru: "Добро Пожаловать!",
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Messages.read();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.postProject = async (req, res) => {
  try {
    const projects = await Projects.read();
    const { name, description, link, usedTechnologies } = req.body;
    const { image } = req.files;
    //VALIDATION
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      link: Joi.string().required(),
      image: Joi.required(),
      usedTechnologies: Joi.string().required(),
    });

    const { error } = schema.validate({
      name,
      description,
      image,
      link,
      usedTechnologies,
    });
    if (error) {
      console.log(error.message);
      return res.status(403).json({ error: error.message });
    }

    //IMAGE
    let imageName = `${uuid()}.${image.mimetype.split("/")[1]}`;
    if (image.mimetype === "image/svg+xml") {
      //SVG fayllarning oxiri MIME type da svg+xml bilan tugar ekan, uni UIga chiqarish uchun image .svg bilan tugashi kerak, shuning uchun shunday qildim
      imageName = `${uuid()}.svg`;
    }
    image.mv(`${process.cwd()}/uploads/${imageName}`);

    //---ID
    const id = uuid();

    //---USED TECHNOLOGIES
    let usedTechsArr = usedTechnologies
      .toUpperCase()
      .split(",")
      .map((item) => item.trim());

    let usedTechs = usedTechsArr.join(",");

    //---NEWBLOG
    const newProject = new Project(
      id,
      name,
      imageName,
      usedTechs,
      link,
      description
    );

    const data = projects.length ? [...projects, newProject] : [newProject];
    // console.log(projects.find(p => p.usedTechnologies.includes("PHP")));
    Projects.write(data);
    res.status(201).json({
      message: {
        uz: "Loyihangiz portfolioga muvaffaqiyatli qo'shildi!",
        en: "Your project was successfully added to the portfolio!",
        ru: "Ваш проект успешно добавлен в портфолио!",
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Projects.read();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exactProject = async (req, res) => {
  try {
    const { id } = req.params;
    const projects = await Projects.read();
    const exactProject = projects.find((project) => project.id === id);
    res.status(200).json(exactProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const projects = await Projects.read();
    const { id } = req.params;
    const restOfProjects = projects.filter((project) => project.id !== id);
    Projects.write(restOfProjects);
    res.status(200).json({ message: "Project deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editProject = async (req, res) => {
  try {
    const projects = await Projects.read();
    const { id } = req.params;
    const { name, description, link, usedTechnologies } = req.body;
    //VALIDATION
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      link: Joi.string().required(),
      usedTechnologies: Joi.string().required(),
    });

    const { error } = schema.validate({
      name,
      description,
      link,
      usedTechnologies,
    });
    if (error) {
      console.log(error.message);
      return res.status(403).json({ error: error.message });
    }
    //EDIT
    const restOfProjects = projects.filter((project) => project.id !== id);
    projects.forEach((project) => {
      if (project.id === id) {
        project.name = name;
        project.description = description;
        project.link = link;
        project.usedTechnologies = usedTechnologies;
        return [...restOfProjects, project];
      }
    });
    Projects.write(projects);
    res.status(200).json({ message: "Project edited successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
