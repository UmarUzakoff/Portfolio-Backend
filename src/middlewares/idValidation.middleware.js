const Joi = require("joi");

const ID_Validation = (req, res, next) => {
  try {
    const { id } = req.params;
    //ID_Validation
    const schema = Joi.object({
        id: Joi.required(),
    });
    
    const { error } = schema.validate({ id });
    if (error) {
        return res.status(403).json({ error: error.message });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = ID_Validation;
