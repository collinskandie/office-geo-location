const Patient = require("../schemas/patient");
const DoctorObservations = require("../schemas/doctorObservations");

const Appointment = require("../schemas/appointment");

const patientController = {
  createPatient: async (req, res, next) => {
    try {
      console.log("Received request body:", req.body);
      const {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        contactNumber,
        emailAddress,
        address,
        nextOfKin,
        imageUrl,
      } = req.body;
      // Create a new patient
      const newPatient = new Patient({
        firstName,
        lastName,
        dateOfBirth,
        gender,
        contactNumber,
        emailAddress,
        address,
        nextOfKin,
        imageUrl,
      });
      // Save the patient to the database
      await newPatient.save();

      res
        .status(201)
        .json({ message: "Patient created successfully", patient: newPatient });
    } catch (error) {
      console.error("Error creating patient:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  updatePatient: async (req, res, next) => {
    try {
      const {
        patientId,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        contactNumber,
        address,
        nextOfKin,
      } = req.body;
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      patient.firstName = firstName;
      patient.lastName = lastName;
      patient.dateOfBirth = dateOfBirth;
      patient.gender = gender;
      patient.contactNumber = contactNumber;
      patient.address = address;
      patient.nextOfKin = nextOfKin;
      await patient.save();
      res
        .status(200)
        .json({ message: "Patient updated successfully", patient });
    } catch (error) {
      console.error("Error updating patient:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getPatients: async (req, res, next) => {
    try {
      const patients = await Patient.find();
      // console.log("patients", patients);
      res.status(200).json({ patients });
    } catch (error) {
      console.error("Error getting patients:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getPatientById: async (req, res, next) => {
    try {
      const patientId = req.params.id;
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.status(200).json({ patient });
    } catch (error) {
      console.error("Error getting patient by id:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  deletePatient: async (req, res, next) => {
    try {
      const { patientId } = req.body;
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      await patient.remove();
      res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
      console.error("Error deleting patient:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  addMedicalRecords: async (req, res, next) => {
    try {
      const { appointment_id, history, examination, diagnosis, treatment } =
        req.body;
      const patient = await Appointment.findById(appointment_id);
      const patient_id = patient.patient;
      const newDoctorObservations = new DoctorObservations({
        appointment: appointment_id,
        patient: patient_id,
        history,
        examination,
        diagnosis,
        treatment,
      });
      await newDoctorObservations.save();
      await Appointment.findByIdAndUpdate(appointment_id, {
        doctorReadings: true,
      });
      res.status(200).json({
        message: "Medical records added successfully",
        newDoctorObservations,
      });
    } catch (error) {
      console.error("Error adding medical records:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getMedicalRecords: async (req, res, next) => {
    try {
      const patient = req.params.id;
      // console.log(patient);
      const observations = await DoctorObservations.find({
        patient: patient,
      });
      console.log(observations);
      res.status(200).json({ medicalRecords: observations });
    } catch (error) {
      console.error("Error getting medical records:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = patientController;
