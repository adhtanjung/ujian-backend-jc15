const router = require("express").Router();
const { registerValidator, checkToken, loginValidator } = require("../helpers");

const {
	userLogin,
	userRegister,
	userDeactiveAccount,
	userActivateAccount,
	userCloseAccount,
} = require("../queries");

// userstatus 1 = active
// userstatus 2 = deactive
// userstatus 3 = closed

// * user register
router.post("/register", registerValidator, userRegister);

// * user login
router.post("/login", loginValidator, userLogin);

// ! deactivate user account with bearer token pls put token on authorization tab in postman, select bearer token
router.patch("/deactive", checkToken, userDeactiveAccount);

// ! activate user  account with bearer token pls put token on authorization tab in postman, select bearer token
router.patch("/activate", checkToken, userActivateAccount);

// ! close user account with bearer token pls put token on authorization tab in postman, select bearer token
router.patch("/close", checkToken, userCloseAccount);
module.exports = router;
