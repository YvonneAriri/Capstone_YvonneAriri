import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

export const createTokens = (result) => {
  const accessToken = sign(
    { username: result.username, id: result.id },
    "jwtsecretplsxhange",
    {
      issuer: "http://localhost:3000",
      expiresIn: "30m",
    }
  );
  return accessToken;
};

export const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  if (!accessToken) {
    return res.status(400).json({ error: "User not Authenticated!" });
  }
  try {
    const validToken = verify(accessToken, "jwtsecretplsxhange");
    if (validToken) {
      req.authenticated = true;
      //   move foward with the request
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};
