const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = (req, res, next) => {
  const authHeader = req.get("authorization");

  if (!authHeader)
    return res.json({ message: "No token provided", success: false });

  const parts = authHeader.split(" ");

  if (!parts.lenght === 2)
    return res.json({ message: "Token error", success: false });

  const [scheme, token] = parts;

  /* /começando a regx ^ indica o inicio da verificação Bearer a palavra que ta buscando. $ para terminar e fecha com / o i indicar que é case insensitive */
  if (!/^Bearer$/i.test(scheme))
    return res.json({ message: "token malformatatted", success: false });

  jwt.verify(token, config.JWT_KEY, (err, decoded) => {
    if (err) return res.json({ message: "Token invalid ", success: false });

    req.userId = decoded.id;
    return next();
  });
};
