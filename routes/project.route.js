import express from 'express';
import { createNewProject} from "../controllers/project.controller.js";
import { verifyToken } from '../middlewares/isAuthenticated.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();


router.post('/createproject', verifyToken, upload.single('image'), createNewProject);



export default router;
