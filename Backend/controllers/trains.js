const oracledb = require("oracledb");
const db = require("../db/db");

const getTrains = async (payload) => {
  const { from, to, classValue, journey_Date } = payload;
  const sql = ``;
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
  const sql = `SELECT * FROM trains t1 WHERE t1.train_name = (
    SELECT t2.train_name FROM trains t2 WHERE t2.train_id = :id
  ) and t1.train_id=:id
  `;
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
