const oracledb = require("oracledb");
const db = require("../db/db");

const getTrains = async (payload) => {
  const { fromStation, toStation, selectedDate, className } = payload;
  const sql = `WITH A AS
  (SELECT T1.TRAIN_ID AS TRAIN_ID, T1.STOP_NO AS FROM_ST_NO ,T2.STOP_NO AS TO_ST_NO , T1.STATION_ID AS FR_ST ,T2.STATION_ID AS TO_ST
    FROM TRAIN_STOPS T1 LEFT OUTER JOIN TRAIN_STOPS T2 ON T1.TRAIN_ID = T2.TRAIN_ID AND T1.STATION_ID <> T2.STATION_ID
  ),
  B AS
  (
  SELECT A.TRAIN_ID AS TRAIN_ID
  FROM A WHERE A.FR_ST = (SELECT STATION_ID FROM STATIONS WHERE STATION_NAME = :fromStation) AND A.TO_ST = (SELECT STATION_ID FROM STATIONS WHERE STATION_NAME = :toStation) AND
  A.FROM_ST_NO < A.TO_ST_NO
  )
  SELECT B.TRAIN_ID 
  FROM B 
  WHERE NOT EXISTS
  (
  SELECT * FROM TRAIN_HOLIDAY WHERE TRAIN_HOLIDAY.TRAIN_ID = B.TRAIN_ID AND TRAIN_HOLIDAY.HOLIDAY_DATE = :selectedDate
  )`;
  const binds = {
    // from: from,
    // to: to,
    // classValue: classValue,
    // journey_Date: journey_Date
  };
  try {
    const result = await db.execute(sql, binds, db.options);
    return result.rows;
  } catch (err) {
    console.log(err.stack);
    throw err;
  }
};

const getTrain = async (payload) => {
  console.log(payload)
  const  id  = payload;
  console.log(`In controller ${id}`);
  const sql = `SELECT TRAIN_NAME FROM TRAINS WHERE TRAIN_ID = :id`;
  const binds = {
    id: id,
  };
  try {
    const result = await db.execute(sql, binds, db.options);
    return result.rows;
  } catch (err) {
    console.log(err.stack);
    throw err;
  }
};

module.exports = {
  getTrains,
  getTrain,
};
