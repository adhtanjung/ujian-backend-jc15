const { query } = require("../database");
const _ = require("lodash");
const { report } = require("../router/userRouter");

// GET ALL MOVIE
const movieGetAll = async (req, res) => {
	try {
		const response = await query(`SELECT m.name,m.release_date,m.release_month,m.release_year,m.duration_min,m.genre,m.description, ms.status,l.location,st.time FROM movies m
    JOIN movie_status ms ON m.status = ms.id JOIN schedules s ON s.movie_id = m.id JOIN locations l ON l.id = s.location_id
    JOIN show_times st ON st.id = s.time_id;`);
		return res.send(response);
	} catch (err) {
		console.log(err);
		return res.send(err.message);
	}
};

// GET MOVIE BY QUERY
const movieGetByQuery = async (req, res) => {
	// get by status, location, time  {on%show,Bandung,9%AM}
	try {
		let sql = `SELECT m.name,m.release_date,m.release_month,m.release_year,m.duration_min,m.genre,m.description, ms.status,l.location,st.time FROM movies m
    JOIN movie_status ms ON m.status = ms.id JOIN schedules s ON s.movie_id = m.id JOIN locations l ON l.id = s.location_id
    JOIN show_times st ON st.id = s.time_id`;

		const { status, location, time } = req.query;

		if (!_.isEmpty(req.query)) {
			sql += " WHERE";

			if (status && location && time) {
				const newStats = status.split("%").join(" ");
				const newTime = time.split("%").join(" ");
				sql += ` ms.status = '${newStats}' AND l.location = '${location}' AND st.time = '${newTime}'`;
			} else {
				length = Object.keys(req.query).length;
				l = 1;
				if (status) {
					const newStats = status.split("%").join(" ");
					if (length > l) {
						sql += ` ms.status = '${newStats}' AND`;
						l++;
					} else {
						sql += ` ms.status = '${newStats}'`;
					}
				}
				if (location) {
					if (length > l) {
						sql += ` l.location = '${location}' AND`;
						l++;
					} else {
						sql += ` l.location = '${location}'`;
					}
				}
				if (time) {
					const newTime = time.split("%").join(" ");
					if (length > l) {
						sql += ` st.time = '${newTime}' AND`;
						l++;
					} else {
						sql += ` st.time = '${newTime}'`;
					}
				}
			}
		}
		const response = await query(sql);
		return res.send(response);
	} catch (err) {
		console.log(err);
		return res.send(err.message);
	}
};

// ADD NEW MOVIE (ADMIN ONLY)
const movieAddNew = async (req, res) => {
	try {
		const {
			name,
			release_date,
			release_month,
			release_year,
			duration_min,
			genre,
			description,
		} = req.body.data;

		let sql = `INSERT INTO movies (name,release_date,release_month,release_year,duration_min,genre,description) VALUES ('${name}', '${release_date}', '${release_month}','${release_year}','${duration_min}','${genre}','${description}')`;

		const response = await query(sql);
		return res.send({ id: response.insertId, ...req.body.data });
	} catch (err) {
		console.log(err);
		return res.send(err.message);
	}
};

// UPDATE MOVIE STATUS
const movieUpdateStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		await query(
			`UPDATE movies SET status = ${status} WHERE id=${parseInt(id)}`
		);
		return res.send({
			id,
			message: "Status has been changed",
		});
	} catch (err) {
		console.log(err);
		return res.send(err.message);
	}
};

const movieAddSchedules = async (req, res) => {
	try {
		const { id } = req.params;
		const { location_id, time_id } = req.body;
		await query(
			`INSERT INTO schedules (movie_id,location_id,time_id) VALUES (${id},${location_id},${time_id})`
		);
		return res.send({
			id,
			message: "Schedule has been added",
		});
	} catch (err) {
		console.log(err);
		return res.send(err.message);
	}
};

module.exports = {
	movieGetAll,
	movieGetByQuery,
	movieAddNew,
	movieUpdateStatus,
	movieAddSchedules,
};
