const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "veryLongSecretKeyveryLongSecretKeyveryLongSecretKeyveryLongSecretKeyveryLongSecretKey");
    req.userData = { email: decodedToken.email, userId: decodedToken.korisnikId };
    if (decodedToken.email !== "s@s" && decodedToken.korisnikId !== "5d4b4a7d11d59916ec10f6ce") {
      throw new Error("decodedToken.email je trebao da bude s@s, a bio je: " + decodedToken.email);
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "check-auth.js: Auth failed!" });
  }
};
