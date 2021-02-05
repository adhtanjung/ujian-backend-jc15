const { query } = require("../database");
const { createJWTToken } = require("../helpers");

// HANDLE USER REGISTER
const userRegister = async (req, res) => {
	try {
		const { email, username, password } = req.body;
		const uid = Date.now();
		const role = 2;
		const status = 1;

		const response = await query(
			`INSERT INTO users (uid,username,email,password,role,status) VALUES ('${uid}', '${username}', '${email}', '${password}', ${role}, ${status})`
		);

		const token = createJWTToken({ uid, role });

		return res.send({
			id: response.insertId,
			uid,
			username,
			email,
			token,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).send(err.message);
	}
};

// HANDLE USER LOGIN
const userLogin = async (req, res) => {
	try {
		const { user, password } = req.body;

		const response = await query(
			`SELECT * FROM users WHERE password = '${password}' AND username ='${user}' OR email = '${user}'`
		);
		const { uid, role, status } = response[0];
		const token = createJWTToken({ uid, role });
		return res.send({
			id: response[0].id,
			uid,
			username: response[0].username,
			email: response[0].email,
			status,
			role,
			token,
		});
	} catch (err) {
		console.log(err.message);
		return res.send(err.message);
	}
};
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNjEyNDM1OTM4NTc0Iiwicm9sZSI6MiwiaWF0IjoxNjEyNDM1OTYwfQ.H7L1RdoD__cFX56JWZ9spoSIO9FQ8JSbfg0KEo_1jNw

// HANDLE DEACTIVATE USER ACCOUNT
const userDeactiveAccount = async (req, res) => {
	try {
		const { uid } = req.user;
		const response = await query(`SELECT * FROM users WHERE uid = '${uid}'`);
		const userId = response[0].uid;
		const status = response[0].status;
		if (status === 3) {
			return res.send({
				message: "Your account status is closed",
				status: "closed",
			});
		} else {
			await query(`UPDATE users SET status =2 WHERE uid='${userId}'`);
			return res.send({
				uid,
				status: "deactive",
			});
		}
	} catch (err) {
		console.log(err);
		res.send(err.message);
	}
};

// HANDLE ACTIVATE USER ACCOUNT
const userActivateAccount = async (req, res) => {
	try {
		const { uid } = req.user;
		const response = await query(`SELECT * FROM users WHERE uid = '${uid}'`);
		const userId = response[0].uid;
		const status = response[0].status;
		if (status === 2) {
			await query(`UPDATE users SET status =1 WHERE uid='${userId}'`);
			return res.send({
				uid,
				status: "active",
			});
		} else if (status === 3) {
			return res.send({
				message: "Your account status is closed",
				status: "Closed",
			});
		}
	} catch (err) {
		console.log(err);
		res.send(err.message);
	}
};

// HANDLE CLOSE USER ACCOUNT
const userCloseAccount = async (req, res) => {
	try {
		const { uid } = req.user;
		await query(`UPDATE users SET status = 3 WHERE uid = '${uid}'`);
		return res.send({
			uid,
			status: "closed",
		});
	} catch (err) {
		console.log(err.message);
		return res.send(err.message);
	}
};
module.exports = {
	userLogin,
	userRegister,
	userDeactiveAccount,
	userActivateAccount,
	userCloseAccount,
};
