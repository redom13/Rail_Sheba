const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/routes", async (req, res, next) => {
  const criteria = req.query.criteria;
  console.log("criteria", criteria);
  try {
    let sql;
    let result;
    if (criteria === "all time") {
      sql = `SELECT (SELECT STATION_NAME FROM STATIONS WHERE STATION_ID=R.FROM_ST) FROM_STATION,(SELECT STATION_NAME FROM STATIONS WHERE STATION_ID=R.TO_ST) TO_STATION,COUNT(*) PASSENGER_CT FROM RESERVATION R NATURAL JOIN BOOKED_SEATS B 
        GROUP BY R.FROM_ST,R.TO_ST
        ORDER BY COUNT(*) DESC
        FETCH FIRST 5 ROWS ONLY`;
      result = await db.execute(sql, [], db.options);
    } else if (criteria === "today") {
      sql = `SELECT (SELECT STATION_NAME FROM STATIONS WHERE STATION_ID=R.FROM_ST) FROM_STATION,(SELECT STATION_NAME FROM STATIONS WHERE STATION_ID=R.TO_ST) TO_STATION,COUNT(*) PASSENGER_CT FROM RESERVATION R NATURAL JOIN BOOKED_SEATS B 
            WHERE R.DATE_OF_JOURNEY = CURRENT_DATE
            GROUP BY R.FROM_ST,R.TO_ST
        ORDER BY COUNT(*) DESC
        FETCH FIRST 5 ROWS ONLY`;
      result = await db.execute(sql, [], db.options);
    } else if (criteria === "this week") {
      sql = `SELECT (SELECT STATION_NAME FROM STATIONS WHERE STATION_ID=R.FROM_ST) FROM_STATION,(SELECT STATION_NAME FROM STATIONS WHERE STATION_ID=R.TO_ST) TO_STATION,COUNT(*) PASSENGER_CT FROM RESERVATION R NATURAL JOIN BOOKED_SEATS B 
            WHERE R.DATE_OF_JOURNEY BETWEEN CURRENT_DATE-7 AND CURRENT_DATE
            GROUP BY R.FROM_ST,R.TO_ST
            ORDER BY COUNT(*) DESC
        FETCH FIRST 5 ROWS ONLY`;
      result = await db.execute(sql, [], db.options);
    } else if (criteria === "this month") {
      sql = `SELECT (SELECT STATION_NAME FROM STATIONS WHERE STATION_ID=R.FROM_ST) FROM_STATION,(SELECT STATION_NAME FROM STATIONS WHERE STATION_ID=R.TO_ST) TO_STATION,COUNT(*) PASSENGER_CT FROM RESERVATION R NATURAL JOIN BOOKED_SEATS B 
            WHERE EXTRACT(MONTH FROM R.DATE_OF_JOURNEY) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM R.DATE_OF_JOURNEY) = EXTRACT(YEAR FROM CURRENT_DATE)
            GROUP BY R.FROM_ST,R.TO_ST
            ORDER BY COUNT(*) DESC
        FETCH FIRST 5 ROWS ONLY`;
      result = await db.execute(sql, [], db.options);
    } else if (criteria === "this year") {
      sql = `SELECT (SELECT STATION_NAME FROM STATIONS WHERE STATION_ID=R.FROM_ST) FROM_STATION,(SELECT STATION_NAME FROM STATIONS WHERE STATION_ID=R.TO_ST) TO_STATION,COUNT(*) PASSENGER_CT FROM RESERVATION R NATURAL JOIN BOOKED_SEATS B 
            WHERE EXTRACT(YEAR FROM R.DATE_OF_JOURNEY) = EXTRACT(YEAR FROM CURRENT_DATE)
            GROUP BY R.FROM_ST,R.TO_ST
            ORDER BY COUNT(*) DESC
        FETCH FIRST 5 ROWS ONLY`;
      result = await db.execute(sql, [], db.options);
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
    next(err);
  }
});

router.get("/weekly", async (req, res, next) => {
    const criteria = req.query.criteria;
  try {
    let weekly;
    if (criteria === "all time") {
    weekly = await db.execute(
      `SELECT 
      TO_CHAR(R.DATE_OF_JOURNEY, 'D') AS DAY_OF_WEEK,
      COUNT(*) AS RESERVATION_CT 
  FROM RESERVATION R 
  NATURAL JOIN BOOKED_SEATS B 
  GROUP BY TO_CHAR(R.DATE_OF_JOURNEY, 'D')`,
      [],
      db.options
    );
    }
    else if (criteria==="this week"){
        weekly =await db.execute(
            `SELECT 
        TO_CHAR(R.DATE_OF_JOURNEY, 'D') AS DAY_OF_WEEK,
        COUNT(*) AS RESERVATION_CT 
    FROM RESERVATION R 
    NATURAL JOIN BOOKED_SEATS B 
    WHERE TO_CHAR(R.DATE_OF_JOURNEY, 'IW') = TO_CHAR(CURRENT_DATE, 'IW')
    AND EXTRACT(YEAR FROM R.DATE_OF_JOURNEY) = EXTRACT(YEAR FROM CURRENT_DATE)
    GROUP BY TO_CHAR(R.DATE_OF_JOURNEY, 'D')`,
            [],
            db.options
        );
    }
    else if (criteria==="this month"){
        weekly =await db.execute(
            `SELECT 
        TO_CHAR(R.DATE_OF_JOURNEY, 'D') AS DAY_OF_WEEK,
        COUNT(*) AS RESERVATION_CT
    FROM RESERVATION R
    NATURAL JOIN BOOKED_SEATS B
    WHERE EXTRACT(MONTH FROM R.DATE_OF_JOURNEY) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(YEAR FROM R.DATE_OF_JOURNEY) = EXTRACT(YEAR FROM CURRENT_DATE)
    GROUP BY TO_CHAR(R.DATE_OF_JOURNEY, 'D')`,
            [],
            db.options
        );
    }
    else if (criteria==="this year"){
        weekly =await db.execute(
            `SELECT 
        TO_CHAR(R.DATE_OF_JOURNEY, 'D') AS DAY_OF_WEEK,
        COUNT(*) AS RESERVATION_CT
    FROM RESERVATION R
    NATURAL JOIN BOOKED_SEATS B
    WHERE EXTRACT(YEAR FROM R.DATE_OF_JOURNEY) = EXTRACT(YEAR FROM CURRENT_DATE)
    GROUP BY TO_CHAR(R.DATE_OF_JOURNEY, 'D')`,
            [],
            db.options
        );
    }
    const allDays = Array.from({ length: 7 }, (_, i) => i + 1); // [1, 2, 3, 4, 5, 6, 7]

    const weeklyWithAllDays = allDays.map((day) => {
      const foundDay = weekly.rows.find((row) => row.DAY_OF_WEEK == day);
      return foundDay ? foundDay : { DAY_OF_WEEK: day, RESERVATION_CT: 0 };
    });

    res.json(weeklyWithAllDays);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
    next(err);
  }
});

module.exports = router;
