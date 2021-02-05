const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const { userRouter, moviesRouter } = require("./router");
const bearerToken = require("express-bearer-token");
const PORT = process.env.PORT || 2000;

// main app
const app = express();

// apply middleware
app.use(cors());
app.use(bodyparser.json());
app.use(bearerToken());

// main route
const response = (req, res) =>
	res.status(200).send("<h1>REST API JCWM-15</h1>");
app.get("/", response);

app.use("/user", userRouter);
app.use("/movies", moviesRouter);

// bind to local machine
app.listen(PORT, () => console.log(`SERVER LISTENING ON PORT ${PORT}`));
