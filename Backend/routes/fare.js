const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/:fromStation/:toStation/:className", async (req, res) => {
  try {
    const { fromStation, toStation, className } = req.params;
    const func = `CREATE OR REPLACE FUNCTION GIVE_FARE (FROM_STAION IN NUMBER,TO_STATION IN NUMBER,CLASS_NAME IN VARCHAR2) RETURN NUMBER IS
    FARE NUMBER;
    BEGIN
        SELECT AMOUNT INTO FARE FROM FARE WHERE FROM_ST = FROM_STAION AND TO_ST = TO_STATION AND CLASS = CLASS_NAME;
        RETURN FARE;
    END;`
    const sql=`SELECT GIVE_FARE((SELECT STATION_ID FROM STATIONS WHERE STATION_NAME = INITCAP(:fromStation)),(SELECT STATION_ID FROM STATIONS WHERE STATION_NAME = INITCAP(:toStation)),:className) as FARE FROM DUAL
    `;
    const binds={
        fromStation:fromStation,
        toStation:toStation,
        className:className
    }
    await db.execute(func,[],db.options);
    const result = await db.execute(sql, binds, db.options);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;