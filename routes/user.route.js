import express from 'express';
import { getMyProfile, getAllUSers,getUser, updateUserProfile, forgotpassword, resetPassword } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/isAuthenticated.js';
import { upload} from "../middlewares/multer.js";

const router = express.Router(); 
 

router.get("/myprofile",verifyToken, getMyProfile);
router.get("/getallusers",verifyToken, getAllUSers);
router.post("/searchuser",verifyToken, getUser);
router.put("/updateprofile", verifyToken, upload.single('photo'), updateUserProfile);

// To reset password using email
router.post('/forgotpass', forgotpassword); 

router.post('/resetpassword', resetPassword); 





export default router;
  