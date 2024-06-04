import express from 'express';
import { createNewGroup, updateGroupStatus } from "../controllers/group.controller.js";
import { verifyToken } from '../middlewares/isAuthenticated.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();


router.post('/creategroup', verifyToken, upload.single('logo'), createNewGroup);
router.put('/updatestatus', verifyToken, updateGroupStatus);



export default router;
