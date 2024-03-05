const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/", async (req, res, next) => {
    try {
        const stations = await db.execute(
        `SELECT STATION_NAME FROM STATIONS`,
        [],
        db.options
        );
        res.json(stations.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
    });

module.exports = router;