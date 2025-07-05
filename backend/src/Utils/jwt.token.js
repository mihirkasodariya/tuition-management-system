const jwt = require("jsonwebtoken");
const {
  ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_KEY_TIME,
} = require("../Config/index.config");

// generate the access token
module.exports.CreateAccessToken = async (userId, type) => {
  if (!userId) return Promise.reject(new Error("User  ID is required"));
  let payload = {
    id: userId,
    __type__: type,
  };

  const config = { expiresIn: ACCESS_TOKEN_KEY_TIME };
  const Token = jwt.sign(payload, ACCESS_TOKEN_KEY, config);

  return Promise.resolve(Token);
};

// verifying the access token
module.exports.VerifyAccessToken = async (token) => {
  try {
    let data = jwt.verify(token, ACCESS_TOKEN_KEY);
    return Promise.resolve({ success: true, ...data });
  } catch (error) {
    return Promise.resolve({ success: false, error });
  }
};
