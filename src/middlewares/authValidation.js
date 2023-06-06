const Joi = require("joi");

const validation = (req, res, next) => {
  try {
    const { username, password } = req.body;
    //VALIDATION
    const schema = Joi.object({
      username: Joi.string().alphanum().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate({ username, password });
    if (error) {
      return res.status(403).json({ error: error.message });
    }

    next();
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

module.exports = validation;
