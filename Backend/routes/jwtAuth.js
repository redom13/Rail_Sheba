const jwt = require("jsonwebtoken");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("../db/db");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middlewares/authorize");
const validinfo = require("../middlewares/validinfo");
require("dotenv").config();

async function createSignUpTrigger() {
  const createTriggerQuery = `
  CREATE OR REPLACE TRIGGER SIGN_UP
  BEFORE INSERT ON PASSENGERS
  FOR EACH ROW
  DECLARE
    CONTACT_CT NUMBER;
    EMAIL_CT NUMBER;
     SIGNUP_EXCEPTION EXCEPTION;
     INVALID_USERNAME EXCEPTION;
  BEGIN
  IF LENGTH(:NEW.nid) <> 15 OR NOT REGEXP_LIKE(:NEW.nid, '^[0-9]+$') THEN
  RAISE SIGNUP_EXCEPTION;
END IF;

-- Check if contact_no is exactly 11 digits
IF LENGTH(:NEW.contact_no) <> 11 OR NOT REGEXP_LIKE(:NEW.contact_no, '^[0-9]+$') THEN
  RAISE SIGNUP_EXCEPTION;
END IF;
    IF :NEW.CONTACT_NO IS NOT NULL THEN
      SELECT COUNT(*) INTO CONTACT_CT FROM LOGIN_CREDENTIALS WHERE USERNAME=:NEW.CONTACT_NO;
      IF CONTACT_CT >0 THEN 
        RAISE INVALID_USERNAME;
      END IF;
    END IF;
    
    IF :NEW.EMAIL IS NOT NULL THEN
      SELECT COUNT(*) INTO EMAIL_CT FROM LOGIN_CREDENTIALS WHERE USERNAME=:NEW.EMAIL;
      IF EMAIL_CT >0 THEN 
        RAISE INVALID_USERNAME;
      END IF;
    END IF;
     -- Check if first_name contains only letters
     IF :NEW.first_name IS NOT NULL AND NOT REGEXP_LIKE(:NEW.first_name, '^[A-Za-z ]+$') THEN
        RAISE SIGNUP_EXCEPTION;
     END IF;

     -- Check if last_name contains only letters
     IF :NEW.last_name IS NOT NULL AND NOT REGEXP_LIKE(:NEW.last_name, '^[A-Za-z ]+$') THEN
        RAISE SIGNUP_EXCEPTION;
     END IF;

  EXCEPTION
     WHEN SIGNUP_EXCEPTION THEN
        -- Handle the exception (you can log, raise an error, or take appropriate action)
        DBMS_OUTPUT.PUT_LINE('Invalid sign-up information');
        RAISE_APPLICATION_ERROR(-20001, 'Invalid sign-up information');
    WHEN INVALID_USERNAME THEN
        DBMS_OUTPUT.PUT_LINE('Invalid sign-up information');
        RAISE_APPLICATION_ERROR(-20001, 'Invalid USERNAME');
  END;
    `;

  try {
    const trigger = await db.execute(createTriggerQuery, [], db.options);
    console.log("SIGN_UP trigger created successfully");
  } catch (error) {
    console.error("Error creating SIGN_UP trigger:", error);
  }
}

// Call the function to create the SIGN_UP trigger

router.post("/register", validinfo.validRegister, async (req, res) => {
  try {
    const {
      nid,
      first_name,
      last_name,
      date_of_birth,
      contact_no,
      idtype,
      email,
      password,
    } = req.body;
    const originalDateString = date_of_birth;
    const datePart = new Date(originalDateString).toISOString().split("T")[0];

    console.log(datePart); // Output: '2003-02-21'

    const user = await db.execute(
      "SELECT * FROM passengers WHERE nid=:nid",
      [nid],
      db.options
    );
    if (user.rows.length !== 0) {
      return res.status(401).json("User already exists");
    }
    const username = idtype === "email" ? email : contact_no;
    console.log(nid);
    console.log(username);
    console.log(password);
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);
    console.log(bcryptPassword);
    // const userEmail = await db.execute(
    //   "SELECT * FROM LOGIN_CREDENTIALS WHERE username=:username",
    //   [username],
    //   db.options
    // );
    // if (userEmail.rows.length !== 0) {
    //   return res
    //     .status(401)
    //     .json("Username already exists!! Try different username:)");
    // }
    const binds = {
      nid: nid,
      first_name: first_name,
      last_name: last_name,
      date_of_birth: datePart,
      contact_no: contact_no,
      email: email,
    };
    const binds2 = {
      username: username,
      nid: nid,
      pass: bcryptPassword,
    };
    createSignUpTrigger();
    const sql = `INSERT INTO passengers(nid,first_name,last_name,date_of_birth,contact_no,email) VALUES(:nid,:first_name,:last_name,TO_DATE(:date_of_birth,'YYYY-MM-DD'),:contact_no,:email)`;
    const newUser = await db.execute(sql, binds, db.options);
    const sql2 = `INSERT INTO LOGIN_CREDENTIALS(USERNAME,NID,LOGIN_PASSWORD) VALUES(:username,:nid,:pass)`;
    const newUser2 = await db.execute(sql2, binds2, db.options);
    const jwtToken = jwtGenerator(nid);
    res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", validinfo.validLogin, async (req, res) => {
  try {
    const { username, password } = req.body;
    const userLogin = await db.execute(
      `SELECT * FROM LOGIN_CREDENTIALS WHERE username=:username`,
      [username],
      db.options
    );
    if (userLogin.rows.length === 0) {
      return res
        .status(401)
        .json("Invalid username! Please provide correct username.");
    }
    const validPassword = await bcrypt.compare(
      password,
      userLogin.rows[0].LOGIN_PASSWORD
    );
    if (!validPassword) {
      return res
        .status(401)
        .json("Invalid password! Please provide correct password");
    }
    console.log("For Login Username:", userLogin.rows[0].USERNAME);
    const jwtToken = jwtGenerator(userLogin.rows[0].USERNAME);
    console.log("login successful");
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.get("/verify", authorize, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
