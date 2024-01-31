const express = require("express");
const router = express.Router();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const db = require("./db/db");
db.startup();

const app = express();

const trainRoutes = require("./routes/trains");

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
    maxAge: 36000,
  })
);

app.use("/api/v1/trains", trainRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
