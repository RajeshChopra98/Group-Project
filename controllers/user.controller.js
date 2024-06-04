import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { isValidEmail } from "../utils/emailValidation.js";
import { uploadToFirebase, deleteImageFromFirebase } from "../utils/uploadToFirebase.js";
import jwt from "jsonwebtoken";


export const getMyProfile = async (req, res, next) => {
    try {

        const currentLoggedInUser = req.user._id;

        let user = await User.findOne({ _id: currentLoggedInUser });

        if (!user) return next(errorHandler(404, "User not found"));

        res.status(200).json(user);
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};



export const getAllUSers = async (req, res, next) => {
    try {
        let users = await User.find({});

        if (users.length === 0) return next(errorHandler(404, "No User exists as of yet!"));

        res.status(200).json(users);
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};

export const getUser = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!isValidEmail(email.toLowerCase())) {
            return next(errorHandler(400, "Invalid email format"));
        }

        let user = await User.findOne({ email: email.toLowerCase() });

        if (!user) return next(errorHandler(404, "Email doesn't exist!"));

        res.status(200).json(user);
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};


export const updateUserProfile = async (req, res, next) => {
    try {
        const currentLoggedInUser = req.user.id;
        const { name, gender, age } = req.body;
        const newPhotoLocalPath = req.file?.path;

        // Handle case where a new photo is uploaded
        if (newPhotoLocalPath) {
            const userData = await User.findById(currentLoggedInUser);
            if (!userData) return next(errorHandler(404, "User doesn't exist!"));

            // Delete the existing photo from Cloudinary
            let { publicId } = userData?.photo;

            if (publicId) {
                await deleteImageFromFirebase(publicId);
            }

            // Upload the new photo to Cloudinary
            const uploadingNewphoto = await uploadToFirebase(newPhotoLocalPath,req.file?.mimetype,"users");
            if (!uploadingNewphoto) return next(errorHandler(500, "Failed to upload photo!"));

            // Update user data with new photo URL
            userData.name = name || userData.name;
            userData.gender = gender || userData.gender;
            userData.age = age || userData.age;
            userData.photo = {
                url: uploadingNewphoto.url, 
                publicId: uploadingNewphoto.publicId
            };

            await userData.save();

            return res.status(200).json({
                success: true,
                message: "User profile updated",
                user: userData
            });
        }

        // Handle case where no new photo is uploaded........

        const updatedData = { ...gender && { gender }, ...name && { name }, ...age && { age } };

        const user = await User.findByIdAndUpdate(currentLoggedInUser, updatedData, { new: true });
        if (!user) return next(errorHandler(404, "User doesn't exist!"));

        return res.status(200).json({
            success: true,
            message: "User profile updated",
            user
        });
    } catch (error) {
        return next(errorHandler(500, error.message));
    }
};



// Forgot Password

export const forgotpassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) return next(errorHandler(404, "Please Enter A Valid Email!"));

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30m',
        });

        user.resetToken = token;
        await user.save();

        let url = token;

        res.status(200).json({
            success: true,
            message: "Use this link to reset your password",
            tokenToResetPassword: url,
            userData: user
        });

    } catch (error) {
        return next(errorHandler(500, error.message || "Error while sending password reset email!"));
    }
};


// Resetting the password...........

export const resetPassword = async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    const { token } = req.query;

    try {
        if (!token) {
            return next(errorHandler(400, "The link is invalid! Please try again"));
        }

        if (!password || !confirmPassword) {
            return next(errorHandler(400, "Password and confirm password fields are required"));
        }

        if (password !== confirmPassword) {
            return next(errorHandler(400, "Password and confirm password do not match!"));
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return next(errorHandler(400, "Invalid or expired token"));
        }

        const user = await User.findOne({ resetToken: token });

        if (!user) {
            return next(errorHandler(404, "User not found!"));
        }

        // Check if the user ID from the token matches the user ID from the database
        if (user._id.toString() !== decoded._id) {
            return next(errorHandler(400, "Token does not match the user"));
        }

        // Updating the user's password, which will trigger the pre-save hook to hash it
        user.password = password;
        user.resetToken = "";
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully!",
            userData: user
        });
    } catch (error) {
        return next(errorHandler(500, error.message || "Error while resetting password"));
    }
};
