const router = require("express").Router();
const { adminValidator } = require("../helpers");
const {
	movieGetAll,
	movieGetByQuery,
	movieAddNew,
	movieUpdateStatus,
	movieAddSchedules,
} = require("../queries");

//GET ALL MOVIES
router.get("/get/all", movieGetAll);

// GET MOVIES BY QUERY
router.get("/get", movieGetByQuery);

// POST NEW MOVIE
// !TOKEN REQUESTED FROM BODY, DON'T USE BEARER TOKEN
router.post("/add", adminValidator, movieAddNew);

// UPDATE MOVIE STATUS
// !TOKEN REQUESTED FROM BODY, DON'T USE BEARER TOKEN
router.patch("/edit/:id", adminValidator, movieUpdateStatus);

// ADD MOVIE SCHEDULES
// !TOKEN REQUESTED FROM BODY, DON'T USE BEARER TOKEN
router.patch("/set/:id", adminValidator, movieAddSchedules);
module.exports = router;
