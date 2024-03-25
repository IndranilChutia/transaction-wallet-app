const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader || !authHeader.startsWith('Bearer ')) {
            try {
                const decoded = await jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
                console.log("Auth Decoded: ", decoded)
                req.userId = decoded.userId;
                next();
            } catch (error) {
                res.status(403).send({ message: "Invalid Token" })
            }

        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal Server Error" })
    }
}

module.exports = authMiddleware;
