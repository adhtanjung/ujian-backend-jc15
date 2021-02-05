const mysql = require("mysql");
const util = require("util");
require("dotenv/config");

const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
});
db.connect((err) => {
	if (err) throw err;
	console.log("connect");
});

const query = util.promisify(db.query).bind(db);
module.exports = {
	query,
};
