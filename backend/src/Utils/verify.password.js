const bycrypt = require("bcrypt");

/**
 * verifying the password
 * @param {Sting} password user password
 * @param {String} hashPassword hashed password
 * @return {Boolean} will return true or false
 */
module.exports.VerifyPasswordMethod = async (password, hashPassword) => {
  let response = await bycrypt.compare(password, hashPassword);
  return response;
};
