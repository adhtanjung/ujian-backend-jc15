const { checkToken, createJWTToken } = require("./jwt");
const {
	registerValidator,
	loginValidator,
	adminValidator,
} = require("./middlewares");
module.exports = {
	checkToken,
	createJWTToken,
	registerValidator,
	loginValidator,
	adminValidator,
};
