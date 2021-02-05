const {
	userLogin,
	userRegister,
	userDeactiveAccount,
	userActivateAccount,
	userCloseAccount,
} = require("./userQuery");
const {
	movieGetAll,
	movieGetByQuery,
	movieAddNew,
	movieUpdateStatus,
	movieAddSchedules,
} = require("./movieQuery");

module.exports = {
	userLogin,
	userRegister,
	userDeactiveAccount,
	userActivateAccount,
	userCloseAccount,
	movieGetAll,
	movieGetByQuery,
	movieAddNew,
	movieUpdateStatus,
	movieAddSchedules,
};
