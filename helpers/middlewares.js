const { query } = require("../database");
const jwt = require("jsonwebtoken");
// userstatus 1 = active
// userstatus 2 = deactive
// userstatus 3 = closed
// ROLE 1 = ADMIN
// ROLE 2 = USER

const registerValidator = async (req, res, next) => {
	try {
		const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
		const { username, email, password } = req.body;

		const responseEmail = await query(
			`SELECT * FROM users WHERE email='${email}'`
		);
		const responseUsername = await query(
			`SELECT * FROM users WHERE username='${username}'`
		);

		if (responseEmail.length > 0 || responseUsername.length > 0) {
			return res.send({
				message:
					"User information already taken, please use different email and username",
			});
		} else {
			if (
				username.length >= 6 &&
				emailRegex.test(email) &&
				passRegex.test(password)
			) {
				next();
			} else {
				return res.send({
					message:
						"Your account details dont't meet the requirements, email address has to be valid, username needs to contain min 6 chars, password needs to contain atleast 6 chars, a number and a special char",
				});
			}
		}
	} catch (err) {
		console.log(err);
		return res.send(err.message);
	}
};

const loginValidator = async (req, res, next) => {
	try {
		const { user, password } = req.body;

		const response = await query(
			`SELECT * FROM users WHERE password = '${password}' AND username='${user}' OR email='${user}'`
		);
		const { status } = response[0];

		if (status === 1) {
			return next();
		} else if (status === 2) {
			return res.send({
				message:
					"Your account status is deactivated, please activate your account first",
				status: "DEACTIVATED",
			});
		} else if (status === 3) {
			return res.send({
				message: "Your account status is closed",
				status: "CLOSED",
			});
		}
	} catch (err) {
		console.log(err);
		return res.send(err.message);
	}
};

const adminValidator = async (req, res, next) => {
	try {
		jwt.verify(req.body.token, "kuncirahasia", (err, decoded) => {
			if (err) {
				return res.status(401).send({
					message: err.message,
					status: "Unauthorized",
				});
			} else {
				const { role } = decoded;

				if (role === 1) {
					return next();
				} else {
					return res.send({
						message: "You're not allowed to perform this action",
					});
				}
			}
		});
	} catch (err) {
		console.log(err);
		return res.send(err.message);
	}
};
module.exports = { registerValidator, loginValidator, adminValidator };
