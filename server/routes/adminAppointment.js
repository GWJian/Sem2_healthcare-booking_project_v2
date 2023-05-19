//adminAppointment.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { isDoctorOrAdmin } = require("../middleware/role");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { GMAIL_EMAIL, GMAIL_PASSWORD } = process.env;

// Read all appointments (only admin and doctor role can access this route)
router.get("/", auth, async (req, res) => {
  try {
    const { role } = req.user;

    let appointments;

    if (role === "admin") {
      appointments = await Appointment.find()
        .populate("doctor")
        .populate("customer");
    } else if (role === "doctor") {
      appointments = await Appointment.find({ doctor: req.user._id })
        .populate("doctor")
        .populate("customer");
    } else if (role === "customer") {
      appointments = await Appointment.find({ customer: req.user._id })
        .populate("doctor")
        .populate("customer");
    }

    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(400).json({
      error,
      message: error.message,
    });
  }
});

// Create a new appointment to that customer(only admin and doctor role can access this route)
router.post("/", auth, isDoctorOrAdmin(), async (req, res) => {
  try {
    const { customerId, doctorId, date, time } = req.body;

    const doctor = await User.findById(doctorId);
    const customer = await User.findById(customerId);

    const appointment = new Appointment({
      customer: customerId,
      doctor: doctorId,
      date,
      time,
    });

    await appointment.save();

    return res.status(200).json({
      appointment,
      doctor: doctor.username,
      customer: customer.username,
    });
  } catch (error) {
    return res.status(400).json({
      error,
      message: error.message,
    });
  }
});

// Delete an appointment (only admin and doctor role can access this route)
router.delete("/:id", auth, isDoctorOrAdmin(), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    return res
      .status(200)
      .json({ message: "Appointment deleted successfully" });
  } catch (error) {
    return res.status(400).json({
      error,
      message: error.message,
    });
  }
});

// Update an appointment status (only doctor role can access this route)
router.put("/:id", auth, isDoctorOrAdmin(), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      "customer"
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // 检查是否是同一个医生被booking的appointment
    if (appointment.doctor.toString() !== req.user._id) {
      return res.status(403).json({
        message: " You are not authorized to update this appointment ",
      });
    }

    appointment.status = req.body.status;

    await appointment.save();

    //Access customer and doctor details
    const doctor = await User.findById(appointment.doctor._id);
    const doctorDetail = {
      username: doctor.username,
      email: doctor.email,
    };

    const customer = await User.findById(appointment.customer._id);
    const customerDetail = {
      username: customer.username,
      email: customer.email,
    };

    // Send email notification to customer
    notificationEmail(customerDetail.email, appointment, doctorDetail);

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

const notificationEmail = (userEmail, appointment, doctorDetail) => {
  let config = {
    host: "smtp.gmail.com",
    auth: {
      user: GMAIL_EMAIL,
      pass: GMAIL_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "E-Healthcare",
      link: "https://mailgen.js/",
    },
  });

  let response = {
    body: {
      name: appointment.customer.username,
      intro: appointment.status,
      table: {
        data: [
          {
            item: "Appointment Date",
            description: appointment.date,
          },
          {
            item: "Appointment Time",
            description: appointment.time,
          },
          {
            item: "Doctor",
            description: doctorDetail.username,
          },
        ],
      },
      outro: "Thank you for using our service.",
    },
  };

  let mail = mailGenerator.generate(response);

  let message = {
    from: GMAIL_EMAIL,
    to: userEmail,
    subject: "Appointment Status",
    html: mail,
  };

  transporter.sendMail(message);
};

module.exports = router;

module.exports = router;
