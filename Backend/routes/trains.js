const express = require("express");
const router = express.Router();
const trainsController = require("../controllers/trains");
const db = require("../db/db");

router.get("/:id", async (req, res, next) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    console.log(id);
    //const decodedID=decodeURIComponent(req.params)
    const train = await trainsController.getTrain(Number(id));
    console.log(train);
    res.json({
      success: true,
      message: "Train searched successfully",
      data: train,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    console.log(req.params);
    const { fromStation, toStation, selectedDate, className } = req.query;
    console.log(fromStation);
    console.log(toStation);
    const selectedDateObject = new Date(selectedDate);
    selectedDateObject.setHours(selectedDateObject.getHours() + 6);

    const datePart = selectedDateObject.toISOString().split("T")[0];
    // const datePart = new Date(selectedDate).toISOString().split("T")[0];
    // console.log("selecteddate:",selectedDate)
    // console.log("datePart:",datePart)
    //console.log(id)
    //const decodedID=decodeURIComponent(req.params)
    const trains = await db.execute(
      `WITH A AS
    (SELECT T1.TRAIN_ID AS TRAIN_ID, T1.STOP_NO AS FROM_ST_NO ,T2.STOP_NO AS TO_ST_NO , T1.STATION_ID AS FR_ST ,T2.STATION_ID AS TO_ST, T1.ARR_TIME AS FROM_ARRIVAL, T1.DEPT_TIME AS FROM_DEPARTURE, T2.ARR_TIME AS TO_ARRIVAL, T2.DEPT_TIME AS TO_DEPARTURE
      FROM TRAIN_STOPS T1 LEFT OUTER JOIN TRAIN_STOPS T2 ON T1.TRAIN_ID = T2.TRAIN_ID AND T1.STATION_ID <> T2.STATION_ID
    ),
    B AS
    (
    SELECT A.TRAIN_ID AS TRAIN_ID,A.FROM_ARRIVAL AS FROM_ARRIVAL, A.FROM_DEPARTURE AS FROM_DEPARTURE, A.TO_ARRIVAL AS TO_ARRIVAL, A.TO_DEPARTURE AS TO_DEPARTURE
    FROM A WHERE A.FR_ST = (SELECT STATION_ID FROM STATIONS WHERE STATION_NAME = :fromStation) AND A.TO_ST = (SELECT STATION_ID FROM STATIONS WHERE STATION_NAME = :toStation) AND
    A.FROM_ST_NO < A.TO_ST_NO
    )
    SELECT B.TRAIN_ID , (SELECT TRAIN_NAME FROM TRAINS WHERE TRAIN_ID = B.TRAIN_ID) TRAIN_NAME , B.FROM_ARRIVAL, B.FROM_DEPARTURE, B.TO_ARRIVAL, B.TO_DEPARTURE
    FROM B 
    WHERE NOT EXISTS
    (
    SELECT * FROM TRAIN_HOLIDAY WHERE TRAIN_HOLIDAY.TRAIN_ID = B.TRAIN_ID AND TRAIN_HOLIDAY.HOLIDAY_DATE = TO_DATE(:datePart, 'YYYY-MM-DD')
    )`,
      [fromStation, toStation, datePart],
      db.options
    );
    console.log(trains);
    res.json({
      success: true,
      message: "Trains searched successfully",
      data: trains,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
    next(err);
  }
});

router.get(`/:fromStation/:toStation`, async (req, res, next) => {
  try {
    const { fromStation, toStation } = req.params;
    console.log(fromStation, toStation);
    const binds = {
      fromStation: fromStation,
      toStation: toStation,
    };
    let ft = fromStation.toString();
    let tt = toStation.toString();
    console.log(ft, tt);
    const fare = await db.execute(
      `SELECT CLASS, AMOUNT
      FROM FARE
      WHERE FROM_ST = (SELECT STATION_ID FROM STATIONS WHERE STATION_NAME = :fromStation) AND TO_ST = (SELECT STATION_ID FROM STATIONS WHERE STATION_NAME = :toStation)
      UNION
      (
      SELECT CLASS, AMOUNT
      FROM FARE
      WHERE FROM_ST = (SELECT STATION_ID FROM STATIONS WHERE STATION_NAME =:toStation) AND TO_ST = (SELECT STATION_ID FROM STATIONS WHERE STATION_NAME = :fromStation)
      )`,
      binds,
      db.options
    );
    console.log(fare);
    res.json({
      success: true,
      message: "Fare searched successfully",
      data: fare,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
    next(err);
  }
});


router.get("/all/trains/details", async (req, res, next) => {
  try {
    const trains = await db.execute(
      `SELECT * FROM TRAINS`,
      [],
      db.options
    );
    console.log(trains);
    res.json({
      success: true,
      message: "Trains searched successfully",
      data: trains,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
    next(err);
  }
});



module.exports = router;
