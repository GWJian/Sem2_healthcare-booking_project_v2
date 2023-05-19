//customer Appointment route
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Appointment = require("../models/Appointment");

//customer can create own appointment
router.post("/", auth, async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    const appointment = new Appointment({
      customer: req.user._id,
      doctor: doctorId,
      date,
      time,
    });

    await appointment.save();

    return res.status(200).json({
      appointment,
    });
  } catch (error) {
    return res.status(400).json({
      error,
      message: error.message,
    });
  }
});

//customer can update own appointment
router.put("/:id", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment.customer.toString() !== req.user._id) {
      return res.status(401).json({
        message: "You are not authorized to update this appointment",
      });
    }

    appointment.status = req.body.status;

    await appointment.save();

    return res.status(200).json({
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    return res.status(400).json({
      error,
      message: error.message,
    });
  }
});

//customer can delete own appointment
router.delete("/:id", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (appointment.customer.toString() !== req.user._id) {
      return res.status(401).json({
        message: "You are not authorized to delete this appointment",
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error,
      message: error.message,
    });
  }
});

//customer can view all own appointment
router.get("/", auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ customer: req.user._id })
      .populate("doctor")
      .populate("customer");
    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(400).json({
      error,
      message: error.message,
    });
  }
});

module.exports = router;
