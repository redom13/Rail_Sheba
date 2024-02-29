const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const db = require("../db/db");

router.get("/:id/:className", async (req, res,next) => {
  try {
    const { id, className } = req.params;
    const sql = `SELECT COMPARTMENT_ID,COMPARTMENT_NAME FROM COMPARTMENTS WHERE TRAIN_ID=:id AND CLASS =:className`;
    const binds = {
      id: id,
      className: className,
    };
    const result = await db.execute(sql, binds, db.options);
    console.log(result);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
    next(err);
  }
});

module.exports = router;