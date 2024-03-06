const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const db = require("../db/db");

router.get("/bookedSeats", async (req, res, next) => {
  try {
    const { trainId, selectedDate } = req.query;
    //console.log("compId,Date:",trainId,selectedDate)
    console.log(selectedDate);
    const selectedDateObject = new Date(selectedDate);
    selectedDateObject.setHours(selectedDateObject.getHours() + 6);

    const datePart = selectedDateObject.toISOString().split("T")[0];
    //console.log(selectedDate)
    // const sql = `SELECT COMPARTMENT_ID,SEAT_NO
    // FROM RESERVATION WHERE COMPARTMENT_ID IN (SELECT COMPARTMENT_ID FROM COMPARTMENTS WHERE TRAIN_ID = :trainId ) AND DATE_OF_JOURNEY = TO_DATE(:selectedDate, 'YYYY-MM-DD')`;
    const sql = `SELECT B.COMPARTMENT_ID,B.SEAT_NO
    FROM RESERVATION R NATURAL JOIN BOOKED_SEATS B WHERE B.COMPARTMENT_ID IN (SELECT COMPARTMENT_ID FROM COMPARTMENTS WHERE TRAIN_ID = :trainId ) AND R.DATE_OF_JOURNEY = TO_DATE(:selectedDate, 'YYYY-MM-DD')`;
    const binds = {
      trainId: trainId,
      selectedDate: datePart,
    };
    const result = await db.execute(sql, binds, db.options);
    console.log("BOOKED SEATS", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
    next(err);
  }
});

// router.post("/", async (req, res, next) => {
//   const {
//     PNR,
//     NID,
//     COMPARTMENT_ID,
//     SEAT_NO,
//     FROM_ST,
//     TO_ST,
//     ISSUE_DATE,
//     DATE_OF_JOURNEY,
//   } = req.body;
//   console.log("req.query:", req.body);
//   try {
//     const sql = `INSERT INTO RESERVATION VALUES (:PNR, :NID, :COMPARTMENT_ID, :SEAT_NO, :FROM_ST, :TO_ST, TO_DATE(:ISSUE_DATE, 'YYYY-MM-DD'), TO_DATE(:DATE_OF_JOURNEY, 'YYYY-MM-DD'))`;
//     const binds = {
//       PNR: PNR,
//       NID: NID,
//       COMPARTMENT_ID: COMPARTMENT_ID,
//       SEAT_NO: SEAT_NO,
//       FROM_ST: FROM_ST,
//       TO_ST: TO_ST,
//       ISSUE_DATE: ISSUE_DATE,
//       DATE_OF_JOURNEY: DATE_OF_JOURNEY,
//     };
//     const result = await db.execute(sql, binds, db.options);
//     console.log("reservation done");
//     console.log("RESERVATION :->", result);
//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//     next(err);
//   }
// });

router.post("/", async (req, res,next) => {
  console.log('POST / route hit');
  const { PNR, NID, SEATS, FROM_ST, TO_ST, ISSUE_DATE, DATE_OF_JOURNEY,TOTAL_FARE } =
  req.body;
  console.log(`ISSUE_DATE: ${ISSUE_DATE}`);
  console.log(`DATE_OF_JOURNEY: ${DATE_OF_JOURNEY}`);
  console.log("req.query:", req.body);

  const selectedDateObject = new Date(ISSUE_DATE);
  selectedDateObject.setHours(selectedDateObject.getHours() + 6);
  const datePart = selectedDateObject.toISOString().split("T")[0];

  const selectedDateObject2 = new Date(DATE_OF_JOURNEY);
  selectedDateObject2.setHours(selectedDateObject2.getHours() + 6);
  const datePart2 = selectedDateObject2.toISOString().split("T")[0];

  // try {
  //   for (let seat of SEATS) {
  //     await db.execute(
  //       `INSERT INTO RESERVATION (PNR, NID, COMPARTMENT_ID, SEAT_NO, FROM_ST, TO_ST, ISSUE_DATE, DATE_OF_JOURNEY)
  //       VALUES (:PNR, :NID, :seat.comId,:seat.no,
  //               (SELECT STATION_ID FROM STATIONS WHERE STATION_NAME = :FROM_ST),
  //               (SELECT STATION_ID FROM STATIONS WHERE STATION_NAME = :TO_ST),
  //               TO_DATE(:ISSUE_DATE, 'YYYY-MM-DD'),
  //               TO_DATE(:DATE_OF_JOURNEY, 'YYYY-MM-DD'));`,
  //       [
  //         PNR,
  //         NID,
  //         seat.compId,
  //         seat.no,
  //         FROM_ST,
  //         TO_ST,
  //         ISSUE_DATE,
  //         DATE_OF_JOURNEY,
  //       ],
  //       db.options
  //     );
  //   }

  //   res.json({ success: true, message: "Reservation successful" });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ success: false, message: "Internal server error" });
  // }
  try {
    //for (let seat of SEATS) {
      await db.execute(
        `INSERT INTO RESERVATION
         VALUES (:PNR, :NID, 
                (SELECT STATION_ID FROM STATIONS WHERE STATION_NAME = :FROM_ST), 
                (SELECT STATION_ID FROM STATIONS WHERE STATION_NAME = :TO_ST), 
                TO_DATE(:datePart, 'YYYY-MM-DD'), 
                TO_DATE(:datePart2, 'YYYY-MM-DD'),
                :TOTAL_FARE)`,
        {
          PNR,
          NID,
          FROM_ST,
          TO_ST,
          TOTAL_FARE,
          datePart,
          datePart2,
          TOTAL_FARE,
        },
        db.options
      );
    //}
    for (let seat of SEATS) {
      const binds = {
        PNR: PNR,
        compId: seat.compId,
        no: seat.no,
      };
      await db.execute(
        `INSERT INTO BOOKED_SEATS
         VALUES (:PNR,:compId, :no)`,
        binds,
        db.options
      );
    }

    res.json({ success: true, message: "Reservation successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
    next(err);
  }
});

module.exports = router;
