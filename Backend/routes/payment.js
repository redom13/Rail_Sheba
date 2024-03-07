const express = require("express");
const router = express.Router();
const db = require("../db/db");

// router.post("/", async (req, res, next) => {
//   const { method, amount, accNo } = req.body;
//   console.log("method:",method);
//   console.log("req.query:",req.body);
//   const methodName =
//     method === "Mobile Pay" ? "MOBILE_BANKING" : "CARD_PAYMENT";
//   const accountNo = method === "Mobile Pay" ? "AC_NO" : "CARD_NO";
//   try {
//     const account = await db.execute(
//       `SELECT * FROM ${methodName} WHERE ${accountNo} = :accNo`,
//       [accNo],
//       db.options
//     );
//     console.log("ACCOUNT :",account);
//     if (account.rows.length === 0) {
//         console.log("ACCOUNT NOT FOUND. Attempting to create account");
//       try {
//         const payment = await db.execute(
//           `INSERT INTO ${methodName}  VALUES (:accNo, 'Fahim')`,
//           [accNo],
//           db.options
//         );
//         res.json({
//           success: true,
//           message: "New account inserted.Payment successful",
//           data: payment,
//         });
//       } catch (err) {
//         console.log(err);
//         res
//           .status(500)
//           .json({ success: false, message: "Internal server error" });
//         next(err);
//       }
//     }
//     else
//     {
//         res.json({
//             success: true,
//             message: "Account is already in database.Payment successful",
//             data: account,
//         });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });

router.post("/", async (req, res, next) => {
  console.log("Req -->", req.body);
  const obj = req.body;

  try {
    const pcdr = `CREATE OR REPLACE PROCEDURE MAKE_PAYMENT(pnr IN VARCHAR2, amount IN NUMBER, method IN VARCHAR2,accNo IN VARCHAR2) IS
    paymentID NUMBER;
    BEGIN
    SELECT paymentID_SEQ.NEXTVAL INTO paymentID FROM DUAL;
    INSERT INTO PAYMENT VALUES (paymentID, pnr, amount, method);
    IF method = 'Mobile Pay' THEN
    INSERT INTO MOBILE_PAY VALUES (accNo, paymentID);
    ELSE
    INSERT INTO CARD_PAY VALUES (accNo, paymentID);
    END IF;
    END;
    `;
    const SQL = await db.execute(pcdr, [], db.options);
    console.log("SQL:", SQL);
    if (obj.method === "Mobile Pay") {
      const account = await db.execute(
        `SELECT * FROM MOBILE_BANKING WHERE AC_NO = :accNo`,
        [obj.accNo],
        db.options
      );
      if (account.rows.length === 0) {
        const payment = await db.execute(
          `INSERT INTO MOBILE_BANKING VALUES (:accNo)`,
          [obj.accNo],
          db.options
        );
        console.log("Payment:", payment);
      }
    }
    else
    {
        const account = await db.execute(
        `SELECT * FROM CARD_PAYMENT WHERE CARD_NO = :accNo`,
        [obj.accNo],
        db.options
          );
          if (account.rows.length === 0) {
            const payment = await db.execute(
              `INSERT INTO CARD_PAYMENT VALUES (:accNo,:holderName)`,
              [obj.accNo,obj.holderName],
              db.options
            );
            console.log("Payment:", payment);
          }
    }
    const rst = 
    `DECLARE
    BEGIN
     MAKE_PAYMENT(:pnr,:amount,:method,:accNo);
      END;
     `;
    const result = await db.execute(rst, [obj.pnr, obj.amount, obj.method,obj.accNo], db.options);
    console.log("Result:", result);
    res.json({ success: true, message: "Payment successful", data: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
