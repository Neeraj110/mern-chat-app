import Router from "express";
import {
  getallUsers,
  getUserProfile,
  googleLogin,
  login,
  logout,
  register,
  resetPassword,
} from "../controllers/userController.js";
import { upload } from "../middleware/multer.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.patch("/reset-password", resetPassword);
router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.post("/google", googleLogin);

router.use(verifyToken);
router.post("/logout", logout);
router.get("/profile", getUserProfile);
router.get("/get-user", getallUsers);

export default router;
