const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "veryLongSecretKeyveryLongSecretKeyveryLongSecretKeyveryLongSecretKeyveryLongSecretKey");
    req.userData = { email: decodedToken.email, userId: decodedToken.korisnikId };
    next();
  } catch (error) {
    res.status(401).json({ message: "check-auth.js: Auth failed!" });
  }
};
