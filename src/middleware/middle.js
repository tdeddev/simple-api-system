const jwt = require('jsonwebtoken')
const config = process.env

const verifyToken = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token']

    if(!token){
        return res.status(403).send("token is required for authentication!")
    }
    
    try {

        let decoded = jwt.verify(token, config.SECERT_KEY);
        req.username = decoded;

    } catch (error) {
        res.status(400).send("Invalid token")
    }

    return next();
}

module.exports = verifyToken