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
        next(err);
    }
    });

router.get("/:train_id",async (req, res, next) => {
    try{
        const {train_id} = req.params;
        console.log("train_id",train_id);
        const stations = await db.execute(
            `SELECT (SELECT STATION_NAME FROM STATIONS WHERE STATION_ID = T.STATION_ID) AS STATION_NAME ,T.ARR_TIME ,T.DEPT_TIME 
            FROM TRAIN_STOPS T WHERE T.TRAIN_ID = :train_id ORDER BY T.STOP_NO ASC`,
            [train_id],
            db.options
        );
        console.log(stations.rows);
        res.json(stations.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).send("Server error");
        next(err);
    }
}
);

module.exports = router;