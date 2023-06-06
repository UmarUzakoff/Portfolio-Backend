const jwt = require('../utils/jwt');

exports.tokenMiddleware = (req,res,next) => {
    try {
        const {token} = req.cookies;
        if (!token) {
            return res.status(401).json({message: "Invalid token!"});
        }
        const verifiedUser = jwt.verify(token);
        req.verifiedUser = verifiedUser.id;
        next();
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};