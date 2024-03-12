const Appointment = require("../schemas/appointment");
const NurseReadings = require("../schemas/nurseReadings");
const appointmentController = {
  newAppointment: async (req, res, next) => {
    try {
      const {
        patient,
        bookingtype,
        appointmentTime,
        doctor,
        bookedBy,
        accompaniedBy,
      } = req.body;
      const newAppo = new Appointment({
        patient,
        bookingType: bookingtype,
        appointmentTime,
        doctor,
        bookedBy,
        accompaniedBy,
      });
      // save
      await newAppo.save();
      res.status(201).json({
        message: "Appointment made successfully",
        appointment: newAppo,
      });
    } catch (error) {
      console.error("Error creating new appoinment", error);
      res.status(500).json({ message: "Error creating appointment" });
    }
  },
  fetchAllAppointments: async (req, res, next) => {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const todayAppointments = await Appointment.find({
        appointmentTime: {
          $gte: todayStart,
          $lt: todayEnd,
        },
      })
        .populate({
          path: "patient",
          model: "Patient",
          select: "firstName lastName",
        })
        .populate({
          path: "bookedBy",
          model: "User",
          select: "profile.firstName profile.lastName",
        })
        .populate({
          path: "doctor",
          model: "User",
          select: "profile.firstName profile.lastName",
        });

      res.status(200).json({
        appointments: todayAppointments,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error finding records" });
    }
  },
  appointmentsByPatient: async (req, res, next) => {
    try {
      const patientId = req.params.id;
      const patients_appointments = await Appointment.find({
        patient: patientId,
      })
        .populate("patient", "firstName lastName") // Replace with the actual fields you want from the Patient model
        .populate("doctor", "profile.firstName profile.lastName") // Replace with the actual fields you want from the User model
        .populate("bookedBy", "profile.firstName profile.lastName"); // Replace with the actual fields you want from the User model

      if (patients_appointments.length === 0) {
        return res.status(404).json({
          message: "Patient has no appointments yet",
          appointments: {},
        });
      }
      res.status(200).json({ appointments: patients_appointments });
    } catch (error) {
      console.error("Error fetching appointment data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  cancleAppointment: async (req, res, next) => {
    const {} = req.body;
  },
  editAppointment: async (req, res, next) => {
    const {} = req.body;
  },
  findAppointment: async (req, res, next) => {
    try {
      const appointment_id = req.params.appointment_id;
      const appointment = await Appointment.findById(appointment_id)
        .populate("patient", "firstName lastName") // Replace "firstName" with the actual field you want to retrieve from the Patient model
        .populate("doctor", "profile.firstName profile.lastName") // Access subfields in the profile object
        .populate("bookedBy", "profile.firstName profile.lastName"); // Access subfields in the profile object

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.status(200).json({ appointment });
    } catch (error) {
      console.error("Error fetching appointment data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  nurseSectionreading: async (req, res, next) => {
    try {
      console.log(req.body);
      const { appointment_id, appointment } = req.body;
      const newReadings = new NurseReadings({
        appointment: appointment_id,
        bloodPressure: appointment.bloodPressure,
        heartRate: appointment.heartRate,
        temperature: appointment.temperature,
        respiratoryRate: appointment.respiratoryRate,
        height: appointment.height,
        weight: appointment.weight,
        pulseOximetry: appointment.pulseOximetry,
        painLevel: appointment.painLevel,
        SpO2: appointment.SpO2,
      });
      await newReadings.save();
      // Update nurseReadings field in the corresponding Appointment
      await Appointment.findByIdAndUpdate(appointment_id, {
        nurseReadings: true,
      });
      res.status(201).json({
        message: "Details saved successfully",
        readings: newReadings,
      });
    } catch (error) {
      console.error("Error creating new recorrds", error);
      res.status(500).json({ message: "Error creating patients records" });
    }
  },
  getNurseReadings: async (req, res, next) => {
    try {
      const appointment_id = req.params.id;
      const nurseReadings = await NurseReadings.findOne({
        appointment: appointment_id,
      });
      res.status(200).json({
        nurseReadings,
        message: "Nurse readings fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching nurse readings:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  //fetch all nurse readings
  fetchAllNurseReadings: async (req, res, next) => {
    try {
      const allNurseReadings = await NurseReadings.find();

      res.status(200).json({ nurseReadings: allNurseReadings });
    } catch (error) {
      console.error("Error fetching all nurse readings:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  fetchWithAppointmentId: async (req, res, next) => {
    try {
      const { appointmentNumber } = req.body;

      // Check if appointmentNumber is provided
      if (!appointmentNumber) {
        return res.status(400).json({
          message: "Appointment number is required for fetching nurse readings",
        });
      }
      // Find nurse readings based on appointment number
      const nurseReadings = await NurseReadings.find({
        appointment: appointmentNumber,
      });

      if (nurseReadings.length === 0) {
        return res.status(404).json({
          message:
            "Nurse readings not found for the specified appointment number",
        });
      }

      res.status(200).json({ nurseReadings });
    } catch (error) {
      console.error("Error fetching nurse readings:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  nurseSectionreadingEditing: async (req, res, next) => {
    try {
      const {
        readingId,
        appointment,
        bloodPressure,
        heartRate,
        temperature,
        respiratoryRate,
        height,
        weight,
        pulseOximetry,
        painLevel,
      } = req.body;

      // Check if readingId is provided
      if (!readingId) {
        return res
          .status(400)
          .json({ message: "Reading ID is required for editing" });
      }

      // Find the nurse reading by ID
      const nurseReading = await NurseReadings.findById(readingId);

      if (!nurseReading) {
        return res.status(404).json({ message: "Nurse reading not found" });
      }

      // Update nurse reading fields
      nurseReading.appointment = appointment;
      nurseReading.bloodPressure = bloodPressure;
      nurseReading.heartRate = heartRate;
      nurseReading.temperature = temperature;
      nurseReading.respiratoryRate = respiratoryRate;
      nurseReading.height = height;
      nurseReading.weight = weight;
      nurseReading.pulseOximetry = pulseOximetry;
      nurseReading.painLevel = painLevel;

      // Save the updated nurse reading
      const updatedNurseReading = await nurseReading.save();

      res.status(200).json({
        message: "Nurse reading updated successfully",
        updatedNurseReading,
      });
    } catch (error) {
      console.error("Error updating nurse reading:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
module.exports = appointmentController;
