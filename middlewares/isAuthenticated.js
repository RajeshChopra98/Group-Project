import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';
import { User } from '../models/user.model.js';

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded._id);

            if (!user) return next(errorHandler(401, "User not found!"));

            req.user = user;
            next();
        } catch (error) {
            return next(errorHandler(401, "Login First and Provide a valid token!"));
        }
    } else {
        return next(errorHandler(401, "Authorization token missing!"));
    }
}