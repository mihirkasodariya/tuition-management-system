const {
  ACCESS_TOKEN_KEY_TIME_COOKIE,
  REFRESH_TOKEN_KEY_TIME_COOKIE,
} = require("../Config/index.config");
const { CreateAcessToken, CreateRefeshToken } = require("../Utils/jwt.token");

module.exports = async (userData, status, res) => {
  const AccessToken = await CreateAcessToken(userData._id, userData.role);
  const RefreshToken = await CreateRefeshToken(userData._id, userData.role);

  const AccessTokenOptions = {
    expires: new Date(
      Date.now() + parseInt(ACCESS_TOKEN_KEY_TIME_COOKIE) * 60 * 1000
    ), // for min
    sameSite: "none",
    secure: true,
    httpOnly: true,
    // maxAge: parseInt(process.env.COOKIE_MAX_TIME),
  };
  const RefreshTokenOptions = {
    expires: new Date(
      Date.now() + parseInt(REFRESH_TOKEN_KEY_TIME_COOKIE) * 8640000
    ), // for day
    sameSite: "none",
    secure: true,
    httpOnly: true,
    // maxAge: parseInt(process.env.COOKIE_MAX_TIME),
  };

  res.cookie("access_token", AccessToken, AccessTokenOptions);
  res.cookie("refresh_token", RefreshToken, RefreshTokenOptions);

  res.status(status).json({
    success: true,
    statusCode: status,
    user: userData,
    AccessToken,
  });
};
