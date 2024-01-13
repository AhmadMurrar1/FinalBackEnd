import { Router } from "express";
import { deleteUser, depositUser, findAllUsers, findUserById, updateUser, userLogin,userProfile,userRegister } from "../controllers/userController.js";
import { isAdmin,isAuth } from "../middleware/auth.js";

const router = Router();

router.post('/register',userRegister);
router.post('/login',userLogin);
router.get('/admin/dashboard',isAuth,isAdmin,userProfile)
router.get('/user-profile', isAuth, userProfile); 
router.get('/users', findAllUsers);
router.get('/users/:id', findUserById);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);
router.post('/users/:id/deposit', depositUser);


export default router;