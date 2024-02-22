const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const db = require("../db/db");

router.get("/", async (req, res,next) => {
  try {
    const { compId, fromStation, toStation, selectedDate } = req.query;
    console.log(selectedDate)
    const selectedDateObject = new Date(selectedDate);
    selectedDateObject.setHours(selectedDateObject.getHours() + 6);

    const datePart = selectedDateObject.toISOString().split("T")[0];
    console.log(selectedDate)
    const sql = `SELECT COMPARTMENT_ID,SEAT_NO FROM reservation WHERE comp_id=:comp_id AND fromStation=:fromStation AND toStation=:toStation AND date=TO_DATE(:date,'YYYY-MM-DD')`;
    const binds = {
      comp_id: compId,
      fromStation: fromStation,
      toStation: toStation,
      date: datePart,
    };
    const result = await db.execute(sql, binds, db.options);
    console.log(result);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
    next(err);
  }
})
module.exports = router;