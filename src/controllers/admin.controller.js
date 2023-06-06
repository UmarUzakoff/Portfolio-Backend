const { v4: uuid } = require("uuid");
const Joi = require("joi");
const fs = require("fs").promises;
const Io = require("../utils/Io");
const Users = new Io("src/database/users.json");
const User = require("../models/User");
const Blogs = new Io("src/database/blogs.json");
const Blog = require("../models/Blog");

//------------------------------------------------------GET_ALL_BLOGS

//POSTMAN: GET , http://localhost:4567/blogs/admin/allBlogs

exports.adminGetAllBlogs = async (req, res) => {
  try {
    const blogs = await Blogs.read();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------------------------------------------BLOG_CONFIRMATION

//POSTMAN: POST , http://localhost:4567/blogs/admin/confirmation/f24f6c1a-9217-44da-93fb-267ce6edcbd3

exports.confirmBlogs = async (req, res) => {
  try {
    const blogs = await Blogs.read();
    const { id } = req.params;
    //--CHECKING IF BLOG IS ALREADY CONFIRMED
    const blogForConfirmation = blogs.find((blog) => blog.id === id);
    if (blogForConfirmation.isConfirmed === true) {
      return res
        .status(200)
        .json({ message: "This blog is already confirmed!" });
    }
    //CONFIRMATION
    const restOfblogs = blogs.filter((blog) => blog.id !== id);
    blogs.forEach((blog) => {
      if (blog.id === id && admin) {
        blog.isConfirmed = true;
        return [...restOfblogs, blog];
      }
    });
    Blogs.write(blogs);
    res.status(201).json({ message: "Successfully confirmed!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
