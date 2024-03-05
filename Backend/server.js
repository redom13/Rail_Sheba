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
app.use("/api/v1/auth",require("./routes/jwtAuth"))
app.use("/api/v1/dashboard",require("./routes/dashboard"))
app.use("/api/v1/compartments",require("./routes/compartments"))
app.use("/api/v1/reservation",require("./routes/reservation"))
app.use("/api/v1/fare",require("./routes/fare"))
app.use("/api/v1/payment",require("./routes/payment"))
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
