require("dotenv").config();
const jwt = require("jsonwebtoken");
const { findByIdUserService } = require("../users/users.service");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "Token not Provided!" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).send({ message: "Invalid Token!" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer^/i.test(scheme)) {
    return res.status(401).send({ message: "Token Bad Format!" });
  }

  jwt.verify(token, process.env.SECRET, async (err, decoded) => {
    const user = findByIdUserService(decoded.id);

    if (err || !user || !user.id) {
      return res.status(401).send({ message: "Invalid Token!" });
    }

    req.userId = user.id;

    return next();
  });
};

