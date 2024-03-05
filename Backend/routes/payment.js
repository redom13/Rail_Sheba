const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.post("/", async (req, res, next) => {
  const { method, amount, accNo } = req.body;
  console.log("method:",method);
  console.log("req.query:",req.body);
  const methodName =
    method === "Mobile Pay" ? "MOBILE_BANKING" : "CARD_PAYMENT";
  const accountNo = method === "Mobile Pay" ? "AC_NO" : "CARD_NO";
  try {
    const account = await db.execute(
      `SELECT * FROM ${methodName} WHERE ${accountNo} = :accNo`,
      [accNo],
      db.options
    );
    console.log("ACCOUNT :",account);
    if (account.rows.length === 0) {
        console.log("ACCOUNT NOT FOUND. Attempting to create account");
      try {
        const payment = await db.execute(
          `INSERT INTO ${methodName}  VALUES (:accNo, 'Fahim')`,
          [accNo],
          db.options
        );
        res.json({
          success: true,
          message: "New account inserted.Payment successful",
          data: payment,
        });
      } catch (err) {
        console.log(err);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
        next(err);
      }
    }
    else
    {
        res.json({
            success: true,
            message: "Account is already in database.Payment successful",
            data: account,
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;