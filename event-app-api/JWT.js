import pkg from "jsonwebtoken";

const { sign, verify } = pkg;
const secretKey = `${process.env.SECRET_KEY}`;
export const createTokens = (result) => {
  //generates an access token using the jsonwebtoken library
  const accessToken = sign(
    { username: result.username },
    // secret key to sign the token
    secretKey,
    {
      issuer: `${process.env.URL}`,
      expiresIn: "30d",
    }
  );
  return accessToken;
};

export const validateToken = (req, res, next) => {
  //created middleware used to validate the access token sent in the request's cookies
  const accessToken = req.cookies["access-token"];
  if (!accessToken) {
    return res.status(400).json({ error: "User not Authenticated!" });
  }
  try {
    const validToken = verify(accessToken, secretKey);
    if (validToken) {
      req.authenticated = true;
      //   move foward with the request
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};
