const express = require("express");
const router = express.Router();
const trainsController = require("../controllers/trains");

router.get("/:id", async (req, res, next) => {
  try {
    console.log(req.params);
    const { id } =req.params;
    console.log(id)
    //const decodedID=decodeURIComponent(req.params)
    const train = await trainsController.getTrain(Number(id));
    console.log(train);
    res.json({
      success: true,
      message: "Train searched successfully",
      data: train
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const trains = await trainsController.getTrains(req.query);
    res.json({
      success: true,
      message: "Trains searched successfully",
      data: trains.rows
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
    next(err);
  }
});

module.exports = router;
