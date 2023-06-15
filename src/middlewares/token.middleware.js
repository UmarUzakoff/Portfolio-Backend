const jwt = require('../utils/jwt');

exports.tokenMiddleware = (req,res,next) => {
    try {
        const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
        if (!token) {
            return res.status(401).json({message: "Invalid token!"});
        }
        const verifiedUser = jwt.verify(token);
        req.verifiedUser = verifiedUser.payload;
        next();
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};