const Appointment = require("../schemas/appointment");
const Payment = require("../schemas/payment");
const paymentController = {
  createPayment: async (req, res, next) => {
    try {
      const { appointment, receivedBy, amount, paymentType, paymentMethod } =
        req.body;
      const newPayment = new Payment({
        appointment,
        receivedBy,
        amount,
        paymentType,
        paymentMethod,
      });
      await newPayment.save();
      await Appointment.findByIdAndUpdate(appointment, {
        $set: { paid: true },
      });
      res.status(201).json({
        message: "Payment submitted successfully",
        payment: newPayment,
      });
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  fetchAllPayments: async (req, res, next) => {
    try {
      const payments = await Payment.find()
        .populate({
          path: "appointment",
          model: "Appointment",
          select: "appointmentTime",
        })
        .populate({
          path: "receivedBy",
          model: "User",
          select: "profile.firstName profile.lastName",
        });
      res.status(200).json({ payments });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  //count payments for a specific date
  todaysPayments: async (req, res, next) => {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const todayPayments = await Payment.find({
        timeOfPayment: {
          $gte: todayStart,
          $lt: todayEnd,
        },
      })
        .populate({
          path: "appointment",
          model: "Appointment",
          select: "appointmentTime",
        })
        .populate({
          path: "receivedBy",
          model: "User",
          select: "profile.firstName profile.lastName",
        });
      res.status(200).json({ todayPayments });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getPayment: async (req, res, next) => {
    try {
      const { appointment, paymentType } = req.params;
      // Assuming that the `appointment` parameter is an ObjectId
      const payment = await Payment.find({
        appointment: appointment,
        paymentType: paymentType,
      })
        .populate({
          path: "appointment",
          model: "Appointment",
          select: "appointmentTime",
          populate: {
            path: "patient", // Populate the patient field in the appointment schema
            model: "Patient",
            select: "firstName lastName address",
          },
        })
        .populate({
          path: "receivedBy",
          model: "User",
          select: "profile.firstName profile.lastName",
        });

      if (!payment || payment.length === 0) {
        return res.status(404).json({ message: "Payment not found" });
      }

      console.log("payment", payment);

      res.status(200).json({ payment });
    } catch (error) {
      console.error("Error getting payment by id:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getPaymentPerUser: async (req, res, next) => {
    try {
      const userId = req.params.user_id;
      const userPayments = await Payment.find({ receivedBy: userId })
        .populate({
          path: "appointment",
          model: "Appointment",
          select: "appointmentTime",
        })
        .populate({
          path: "receivedBy",
          model: "User",
          select: "profile.firstName profile.lastName",
        });
      if (userPayments.length === 0) {
        return res.status(404).json({
          message: "User has no payments yet",
          payments: {},
        });
      }
      res.status(200).json({ payments: userPayments });
    } catch (error) {
      console.error("Error fetching user payments:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
module.exports = paymentController;
