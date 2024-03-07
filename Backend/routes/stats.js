const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/routes", async (req, res, next) => {
    const  year  = req.query.year;
    try {
        const sql = `SELECT (SELECT STATION_NAME FROM STATIONS WHERE STATION_ID=R.FROM_ST) FROM_STATION,(SELECT STATION_NAME FROM STATIONS WHERE STATION_ID=R.TO_ST) TO_STATION,COUNT(*) PASSENGER_CT FROM RESERVATION R NATURAL JOIN BOOKED_SEATS B 
        WHERE EXTRACT(YEAR FROM R.DATE_OF_JOURNEY)=:year
        GROUP BY R.FROM_ST,R.TO_ST
        ORDER BY COUNT(*) DESC
        FETCH FIRST 5 ROWS ONLY`;
        const result = await db.execute(sql, [year], db.options);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
        next(err);
    }
    });

module.exports = router;