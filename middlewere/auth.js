var jwt = require('jsonwebtoken');
var JWT_SECRET = "impoNexpo";
const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).send({ error: "Please authenticate a valid token" })
    }
}
module.exports = auth;