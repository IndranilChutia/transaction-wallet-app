const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader || !authHeader.startsWith('Bearer ')) {
        try {
            const decoded = await jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
            req.userId = decoded.userId;
            console.log(decoded)
            next();
        } catch (error) {
            res.status(403).send({ message: "Invalid Token" })
        }

    }

}

module.exports = authMiddleware;
