import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { generateToken } from "../utils/generateToken.js";
import { uploadToFirebase } from "../utils/uploadToFirebase.js";



export const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, age, gender } = req.body;

    if ([name, email, password, confirmPassword, age, gender].some((field) => field?.trim() === "")) {
      return next(errorHandler(400, "Please provide all the fields!"));
    }
    if (password !== confirmPassword) return next(errorHandler(400, "Passwords do not match"));

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) return next(errorHandler(409, "User Already Exists"));

    const photoLocalPath = req.file?.path;

    if (!photoLocalPath) return next(errorHandler(400, "Photo is required!"));

    const uploadedphoto = await uploadToFirebase(photoLocalPath,req.file?.mimetype,"users");

    if (!uploadedphoto) return next(errorHandler(500, "Failed to upload photo!"));

    let userData = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      photo: { url: uploadedphoto.url, publicId: uploadedphoto.publicId },
      age,
      gender
    });

    if (userData) {
      const { password: hashPassword, ...Data } = userData._doc;
      generateToken(Data, res, "Registered Successfully", 201);
    }

    else {
      return next(errorHandler(500, "Failed to Register User!"));
    }

  } catch (error) {
    return next(errorHandler(500, error.message || "Error while registering user"));
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) return next(errorHandler(400, "Please provide all the fields!"));

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) return next(errorHandler(404, "User not found"));

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) return next(errorHandler(401, "wrong credentials"));

    // Generating a token using jwt...
    const { password: hashedPassword, ...userData } = user._doc;

    generateToken(userData, res, `Welcome back, ${userData.name}`, 200);

  } catch (error) {
    return next(errorHandler(500, error.message || "Error while Logging in"));
  }
};

export const logout = (req, res) => {
  res.status(200).json("Logged out successfully!");
};
