const { v4: uuid } = require("uuid");
const Joi = require("joi");
const fs = require("fs").promises;
const Io = require("../utils/Io");
const Users = new Io("src/database/users.json");
const User = require("../models/User");
const Blogs = new Io("src/database/blogs.json");
const Blog = require("../models/Blog");
const Likes = new Io("src/database/likes.json");
const Like = require("../models/Like");

//------------------------------------------------------LIKE

//POSTMAN: POST , http://localhost:4567/blogs/like/f24f6c1a-9217-44da-93fb-267ce6edcbd3

exports.like = async (req, res) => {
  try {
    const blogs = await Blogs.read();
    const likes = await Likes.read();
    const { id } = req.params;
    ////////////////////////
    const likedAtBlog = blogs.find((blog) => blog.id === id);
    const findLike = likes.find(
      (like) => like.blog_id === id && like.user_id === req.verifiedUser
    );
    ////////////////////////////////////////////////////////////////
    let data;
    let jsonMessage;
    if (findLike) {
      jsonMessage = "Your like is reinstated.";
      data = likes.filter(
        (like) => like.user_id !== req.verifiedUser || like.blog_id !== id
      );
      const countOfLikes = data.filter((like) => like.blog_id === id);
      const restOfBlogs = blogs.filter((blog) => blog.id !== likedAtBlog.id);
      blogs.forEach((blog) => {
        if (blog.id === likedAtBlog.id) {
          blog.likes = countOfLikes.length;
          return [...restOfBlogs, blog];
        }
      });
      Blogs.write(blogs);
    } else {
      jsonMessage = "Successfully liked!";
      const newLike = new Like(id, req.verifiedUser);
      data = likes.length ? [...likes, newLike] : [newLike];
      const countOfLikes = data.filter((like) => like.blog_id === id);
      const restOfBlogs = blogs.filter((blog) => blog.id !== likedAtBlog.id);
      blogs.forEach((blog) => {
        if (blog.id === likedAtBlog.id) {
          blog.likes = countOfLikes.length;
          return [...restOfBlogs, blog];
        }
      });
      Blogs.write(blogs);
    }
    Likes.write(data);
    res.status(201).json({ message: jsonMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
