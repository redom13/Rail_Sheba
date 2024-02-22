const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const db = require("../db/db");

router.get("/bookedSeats", async (req, res, next) => {
  try {
    const { compId,selectedDate } = req.query;
    console.log("compId,Date:",compId,selectedDate)
    console.log(selectedDate)
    const selectedDateObject = new Date(selectedDate);
    selectedDateObject.setHours(selectedDateObject.getHours() + 6);

    const datePart = selectedDateObject.toISOString().split("T")[0];
    //console.log(selectedDate)
    const sql = `SELECT (SELECT COMPARTMENT_NAME FROM COMPARTMENTS WHERE COMPARTMENT_ID =:compId ) AS COMPARTMENT_NAME ,SEAT_NO FROM reservation WHERE COMPARTMENT_ID =:compId AND DATE_OF_JOURNEY = TO_DATE(:selectedDate,'YYYY-MM-DD')`;
    const binds = {
      compId: compId,
      selectedDate: datePart,
    };
    const result = await db.execute(sql, binds, db.options);
    console.log("BOOKED SEATS",result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
    next(err);
  }
})
module.exports = router;