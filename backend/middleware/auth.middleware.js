const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
     const authorization = req.headers.authorization;
    if (!authorization) {
    return res.status(401).json({
        message: "No token, authorization denied"
    });
}

    const [scheme,token] = authorization.split(" ");
    if (scheme !== "Bearer") {
    return res.status(401).json({
        message: "Invalid authorization scheme"
    });
}

    if (!token) {
    return res.status(401).json({
        message: "No token, authorization denied"
    });
}

    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    }
    catch(err)
    {
    return res.status(401).json({
        message: "Invalid token"
    })
    }
}
module.exports = authMiddleware;