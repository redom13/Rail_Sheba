const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const db = require("../db/db");

router.get("/bookedSeats", async (req, res, next) => {
  try {
    const { trainId, selectedDate, fromStation, toStation } = req.query;
    //console.log("compId,Date:",trainId,selectedDate)
    console.log(selectedDate);
    const selectedDateObject = new Date(selectedDate);
    selectedDateObject.setHours(selectedDateObject.getHours() + 6);

    const datePart = selectedDateObject.toISOString().split("T")[0];
    //console.log(selectedDate)
    // const sql = `SELECT COMPARTMENT_ID,SEAT_NO
    // FROM RESERVATION WHERE COMPARTMENT_ID IN (SELECT COMPARTMENT_ID FROM COMPARTMENTS WHERE TRAIN_ID = :trainId ) AND DATE_OF_JOURNEY = TO_DATE(:selectedDate, 'YYYY-MM-DD')`;
    // const sql = `SELECT B.COMPARTMENT_ID,B.SEAT_NO
    // FROM RESERVATION R NATURAL JOIN BOOKED_SEATS B WHERE B.COMPARTMENT_ID IN (SELECT COMPARTMENT_ID FROM COMPARTMENTS WHERE TRAIN_ID = :trainId ) AND R.DATE_OF_JOURNEY = TO_DATE(:selectedDate, 'YYYY-MM-DD')`;
    // const binds = {
    //   trainId: trainId,
    //   selectedDate: datePart,
    // };
    const sql1 = `CREATE OR REPLACE FUNCTION OVERLAP (FROM_ST1 IN VARCHAR2,TO_ST1 IN VARCHAR2, FROM_ST2 IN NUMBER,TO_ST2 IN NUMBER,TID IN NUMBER) 
    RETURN NUMBER IS
    STOP_NO1 NUMBER;
    STOP_NO2 NUMBER;
    STOP_NO3 NUMBER;
    STOP_NO4 NUMBER;
    MSG NUMBER;
    BEGIN
    SELECT STOP_NO INTO STOP_NO1
    FROM TRAIN_STOPS WHERE  TRAIN_ID =TID AND STATION_ID = (SELECT STATION_ID FROM STATIONS WHERE STATION_NAME = INITCAP(FROM_ST1));
    SELECT STOP_NO INTO STOP_NO2
    FROM TRAIN_STOPS WHERE  TRAIN_ID =TID AND STATION_ID = (SELECT STATION_ID FROM STATIONS WHERE STATION_NAME = INITCAP(TO_ST1));
    SELECT STOP_NO INTO STOP_NO3
    FROM TRAIN_STOPS WHERE  TRAIN_ID =TID AND STATION_ID = FROM_ST2;
    SELECT STOP_NO INTO STOP_NO4
    FROM TRAIN_STOPS WHERE  TRAIN_ID =TID AND STATION_ID = TO_ST2;
    DBMS_OUTPUT.PUT_LINE(STOP_NO1||' '||STOP_NO2||' '||STOP_NO3||' '||STOP_NO4);
    IF STOP_NO4 <= STOP_NO1 THEN 
    MSG:=0;
    ELSIF STOP_NO3 >= STOP_NO2 THEN
    MSG :=0;
    ELSE
    MSG:=1;
     END IF ;
     RETURN MSG;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
        MSG := 2 ;
        RETURN MSG;
        WHEN TOO_MANY_ROWS THEN
        MSG := 4 ;
        RETURN MSG;
        WHEN OTHERS THEN
        MSG := 6 ;
        RETURN MSG;
    END;`;
    
    const rst = await db.execute(sql1, [], db.options);
    const binds = {
      trainId: trainId,
      selectedDate: datePart,
      fromStation: fromStation,
      toStation: toStation,
    };
    const sql2 =`SELECT B.COMPARTMENT_ID,B.SEAT_NO
    FROM RESERVATION R NATURAL JOIN BOOKED_SEATS B WHERE B.COMPARTMENT_ID IN (SELECT COMPARTMENT_ID FROM COMPARTMENTS WHERE TRAIN_ID = :trainId ) AND R.DATE_OF_JOURNEY = TO_DATE(:selectedDate, 'YYYY-MM-DD') AND OVERLAP(:fromStation,:toStation,R.FROM_ST,R.TO_ST,:trainId)=1`;
    const result = await db.execute(sql2, binds, db.options);
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
router.delete("/:pnr", async (req, res, next) => {
  try {
    const { pnr } = req.params;
    const sql = `DELETE FROM RESERVATION WHERE PNR = :pnr`;
    const binds = { pnr: pnr };
    const result = await db.execute(sql, binds, db.options);
    console.log("RESERVATION :->", result);
    if (result.rowsAffected === 0) {
      res.status(404).json({ message: 'Reservation not found' });
    } else {
      res.json({ message: 'Reservation deleted successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
    next(err);
  }
});

router.get("/:nid",async (req, res, next) => {
  try {
    const { nid } = req.params;
    const sql = `SELECT R.PNR, (SELECT STATION_NAME FROM STATIONS WHERE STATION_ID=R.FROM_ST) FROM_STATION,(SELECT STATION_NAME FROM STATIONS WHERE STATION_ID=R.TO_ST) TO_STATION,
    R.ISSUE_DATE,R.DATE_OF_JOURNEY,R.TOTAL_FARE FROM RESERVATION R WHERE R.NID = :nid AND R.DATE_OF_JOURNEY>=TO_DATE(SYSDATE)`;
    const binds = { nid: nid };
    const result = await db.execute(sql, binds, db.options);
    console.log("RESERVATION :->", result);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
    next(err);
  }
}
);

router.post("/", async (req, res, next) => {
  console.log("POST / route hit");
  const {
    PNR,
    NID,
    SEATS,
    FROM_ST,
    TO_ST,
    ISSUE_DATE,
    DATE_OF_JOURNEY,
    TOTAL_FARE,
  } = req.body;
  console.log(`ISSUE_DATE: ${ISSUE_DATE}`);
  console.log(`DATE_OF_JOURNEY: ${DATE_OF_JOURNEY}`);
  console.log("req.query:", req.body);

  const selectedDateObject = new Date(ISSUE_DATE);
  selectedDateObject.setHours(selectedDateObject.getHours() + 6);
  const datePart = selectedDateObject.toISOString().split("T")[0];

  const selectedDateObject2 = new Date(DATE_OF_JOURNEY);
  selectedDateObject2.setHours(selectedDateObject2.getHours() + 6);
  const datePart2 = selectedDateObject2.toISOString().split("T")[0];

  try {
    //for (let seat of SEATS) {
    const sql =
     ` CREATE OR REPLACE TRIGGER RESERVATION_TRIGGER
      BEFORE INSERT ON BOOKED_SEATS
      FOR EACH ROW
      DECLARE
      JOURNEY_DATE DATE;
      EX EXCEPTION;
      COMP_ID NUMBER;
      SEAT_NO NUMBER;
      FROM_ST_NAME VARCHAR2(100);
      TO_ST_NAME VARCHAR2(100);
      BEGIN
      SELECT DATE_OF_JOURNEY INTO JOURNEY_DATE FROM RESERVATION WHERE PNR = :NEW.PNR;
      SELECT (SELECT STATION_NAME FROM STATIONS WHERE STATION_ID = R.FROM_ST) INTO FROM_ST_NAME 
      FROM RESERVATION R WHERE R.PNR = :NEW.PNR;
      SELECT (SELECT STATION_NAME FROM STATIONS WHERE STATION_ID = R.TO_ST) INTO TO_ST_NAME
      FROM RESERVATION R WHERE R.PNR = :NEW.PNR;

      FOR R IN ( SELECT B.COMPARTMENT_ID,B.SEAT_NO
        FROM RESERVATION R NATURAL JOIN BOOKED_SEATS B WHERE 
        B.COMPARTMENT_ID IN (SELECT COMPARTMENT_ID FROM COMPARTMENTS WHERE TRAIN_ID = (SELECT TRAIN_ID FROM COMPARTMENTS WHERE COMPARTMENT_ID = :NEW.COMPARTMENT_ID)) 
        AND R.DATE_OF_JOURNEY = JOURNEY_DATE  
        AND OVERLAP(FROM_ST_NAME,TO_ST_NAME,R.FROM_ST,R.TO_ST,(SELECT TRAIN_ID FROM COMPARTMENTS WHERE COMPARTMENT_ID = :NEW.COMPARTMENT_ID))=1 )
        LOOP
        IF R.COMPARTMENT_ID = :NEW.COMPARTMENT_ID AND R.SEAT_NO = :NEW.SEAT_NO THEN
        DELETE FROM BOOKED_SEATS WHERE PNR = :NEW.PNR;
        DELETE FROM RESERVATION WHERE PNR = :NEW.PNR;
        RAISE EX;
        END IF;
        END LOOP;
        EXCEPTION
        WHEN EX THEN
        RAISE_APPLICATION_ERROR(-20001, 'Seat is already booked');
        END;`;

    const rst = await db.execute(sql, [], db.options);

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
    const errSql1 =
    `DELETE FROM BOOKED_SEATS WHERE PNR = :PNR`;
    const errSql2=
    ` DELETE FROM RESERVATION WHERE PNR = :PNR`;
    const errBinds = {
      PNR: PNR,
    };
    try {
      console.log("deleting reservation");
      await db.execute(errSql1, errBinds, db.options);
      await db.execute(errSql2, errBinds, db.options);
    }
    catch (err) {
      console.log(err);
    }
    res.status(500).json({ success: false, message: "Internal server error" });
    next(err);
  }
});

module.exports = router;
