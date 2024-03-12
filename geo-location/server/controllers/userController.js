const bcrypt = require("bcrypt");
const User = require("../schemas/users");
const { generateToken } = require("../middleware/tokens");

const userController = {
  registerUser: async (req, res, next) => {
    try {
      const { username, password, roles, profile } = req.body;
      // Check if the username is already taken
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ message: "Username is already taken" });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      // Create a new user
      const newUser = new User({
        username,
        password: hashedPassword,
        roles,
        profile,
      });
      // Save the user to the database
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  //edit user
  editUser: async (req, res, next) => {
    try {
      const { userid, username, password, roles, profile } = req.body;
      const user_details = await User.findById({ userid });
      if (!user_details) {
        return res.json(404).json({ message: "User not found" });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      user_details.username = username;
      user_details.password = hashedPassword;
      user_details.roles = roles;
      user_details.profile = profile;
      const updated_userDetails = await user_details.save();
      res.status(200).json({
        message: "User details updated",
        updated_userDetails,
      });
    } catch (error) {}
  },
  getUser: async (req, res, next) => {
    try {
      const user = req.params.user;
      // console.log(user);
      const user_details = await User.findById({ user });
      console.log(user_details);
      if (!user_details) {
        return res.json(404).json({ message: "User not found" });
      }
      console.log(user_details);
      res.status(200).json({ message: "User found", user_details });
    } catch (error) {}
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.find();
      if (!users) {
        return res.json(404).json({ message: "Users not found" });
      }
      res.status(200).json({ message: "Users found", users });
    } catch (error) {}
  },
  // Add more controller methods as needed
  loginUser: async (req, res, next) => {
    try {
      // console.log(req.body);
      const { email, password } = req.body;
      const username = email;
      const user = await User.findOne({ username });
      // console.log(user);
      if (!user) {
        // console.log("User not found");
        return res.status(404).json({ message: "User not found" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
      // Create a JWT token
      const token = generateToken(user);
      // Send the token and user details in the response
      res.status(200).json({
        message: "User logged in successfully",
        token,
        user: {
          id: user._id,
          username: user.username,
          roles: user.roles,
          profile: user.profile,
        },
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = userController;
