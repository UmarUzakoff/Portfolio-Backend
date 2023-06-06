const { v4: uuid } = require("uuid");
const Joi = require("joi");
const fs = require("fs").promises;
const Io = require("../utils/Io");
const Users = new Io("src/database/users.json");
const User = require("../models/User");
const Blogs = new Io("src/database/blogs.json");
const Blog = require("../models/Blog");
const Views = new Io("src/database/views.json");
const View = require("../models/View");

//------------------------------------------------------GET_CONFIRMED_BLOGS

//POSTMAN: GET , http://localhost:4567/blogs

exports.getConfirmedBlogs = async (req, res) => {
  try {
    const blogs = await Blogs.read();
    // --USERS CAN SEE ONLY CONFIRMED BLOGS
    const confirmedBlogs = blogs.filter((blog) => blog.isConfirmed === true);
    res.status(200).json(confirmedBlogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------------------------------------------GET_PERSONAL_BLOGS

//POSTMAN: GET , http://localhost:4567/blogs/personalBlogs

exports.personalBlogs = async (req, res) => {
  try {
    const blogs = await Blogs.read();
    // --USERS CAN SEE ONLY PERSONAL BLOGS
    const personalBlogs = blogs.filter(
      (blog) => blog.user_id == req.verifiedUser
    );
    res.status(200).json(personalBlogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------------------------------------------GET_EXACT_BLOG-------VIEWS!!!

//POSTMAN: GET , http://localhost:4567/blogs/8b798385-d542-400b-aadf-d0d645d3b0e5

exports.exactBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blogs = await Blogs.read();
    const views = await Views.read();
    // --USERS CAN SEE ONLY ONE BLOG THAT HE WANTS TO SEE WITH THE DETAILED INFORMATION OF THAT BLOG
    const exactBlog = blogs.find((blog) => blog.id === id);
    //----------------VIEWS
    const findView = views.find(
      (view) => view.blog_id == id && view.user_id == req.verifiedUser
    );
    if (!findView) {
      const newView = new View(id, req.verifiedUser);
      const data = views.length ? [...views, newView] : [newView];
      Views.write(data);
      var viewsOfThisBlog = views.filter((view) => view.blog_id === id);
      const restOfBlogs = blogs.filter((blog) => blog.id !== id);
      blogs.forEach((blog) => {
        if (blog.id === id) {
          blog.views = viewsOfThisBlog.length + 1;
          return [...restOfBlogs, blog];
        }
      });
      Blogs.write(blogs);
    }
    res.status(200).json(exactBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------------------------------------------POST

//POSTMAN: POST , http://localhost:4567/blogs/delete/8b798385-d542-400b-aadf-d0d645d3b0e5 , form-data: title && image && description ...

exports.blogPost = async (req, res) => {
  try {
    const users = await Users.read();
    const blogs = await Blogs.read();
    const verifiedUser = users.find((user) => user.id === req.verifiedUser);
    const { title, description } = req.body;
    const { image } = req.files;
    //VALIDATION
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.required(),
    });

    const { error } = schema.validate({ title, description, image });
    if (error) {
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
    console.log(req.verifiedUser);
    const user_id = verifiedUser.id;

    //---NEWBLOG
    const newBlog = new Blog(id, title, description, imageName, user_id);

    const data = blogs.length ? [...blogs, newBlog] : [newBlog];
    Blogs.write(data);
    res.status(201).json({
      message:
        "Blog created successfully! Soon administrator will check and confirm it.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------------------------------------------EDIT

//POSTMAN: POST , http://localhost:4567/blogs/edit/8b798385-d542-400b-aadf-d0d645d3b0e5 , form-data: title || image || description ...

exports.blogEdit = async (req, res) => {
  try {
    const blogs = await Blogs.read();
    const { id } = req.params;
    const { title, description } = req.body;
    const { image } = req.files;
    // USER FAQAT O'ZI KIRITGAN BLOGLARNIGINA O'ZGARTIRA OLADI
    const personalBlogs = blogs.filter(
      (blog) => blog.user_id == req.verifiedUser
    );
    //VALIDATION
    const schema = Joi.object({
      id: Joi.required(),
      title: Joi.string(),
      description: Joi.string(),
    });

    const { error } = schema.validate({ id, title, description });
    if (error) {
      return res.status(403).json({ error: error.message });
    }
    //EDIT
    const findBlog = personalBlogs.find((blog) => blog.id === id);
    if (!findBlog) {
      return res.status(403).json({
        message:
          "You are not allowed to edit this blog! You can edit only your personal blogs.",
      });
    }
    const restOfblogs = personalBlogs.filter((blog) => blog.id !== id);
    personalBlogs.forEach((blog) => {
      if (blog.id === id) {
        blog.title = title;
        blog.description = description;
        if (image) {
          //IMAGE
          let imageName = `${uuid()}.${image.mimetype.split("/")[1]}`;
          if (image.mimetype === "image/svg+xml") {
            //SVG fayllarning oxiri MIME type da svg+xml bilan tugar ekan, uni UIga chiqarish uchun image .svg bilan tugashi kerak, shuning uchun shunday qildim
            imageName = `${uuid()}.svg`;
          }
          image.mv(`${process.cwd()}/uploads/${imageName}`);
          //UPLOADS_dan ESKI RASMNI CHOPISH XOTIRADAN JOY OLMASLIGI UCHUN, LEKIN HAQIQIY PROJECT_larda ARCHIVE_ga OLIB QO'YILINADI
          fs.unlink(`${process.cwd()}/uploads/${blog.image}`);
          blog.image = imageName;
        }
        return [...restOfblogs, blog];
      }
    });
    Blogs.write(blogs);
    res.status(200).json({ message: "Blog edited successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------------------------------------------DELETE

//POSTMAN: POST , http://localhost:4567/blogs/delete/8b798385-d542-400b-aadf-d0d645d3b0e5

exports.blogDelete = async (req, res) => {
  try {
    const blogs = await Blogs.read();
    const { id } = req.params;
    // USER FAQAT O'ZI KIRITGAN BLOGLARNIGINA O'ZGARTIRA OLADI
    const personalBlogs = blogs.filter(
      (blog) => blog.user_id == req.verifiedUser
    );
    //DELETE
    const findBlog = personalBlogs.find((blog) => blog.id === id);
    if (!findBlog) {
      return res.status(403).json({
        message:
          "You are not allowed to delete this blog! You can delete only your personal blogs.",
      });
    }
    const restOfblogs = blogs.filter((blog) => blog.id !== id);
    Blogs.write(restOfblogs);
    res.status(200).json({ message: "Blog deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
