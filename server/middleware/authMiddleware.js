const jwt = require("jsonwebtoken");

exports.verifyRole = (roles) => {
  return (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!roles.includes(decoded.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    req.user = decoded;
    next();
  };
};
