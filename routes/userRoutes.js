import { Router } from "express";
import { deleteUser, depositUser, findAllUsers, findUserById, updateUser, userLogin,userProfile,userRegister } from "../controllers/userController.js";
import { isAdmin,isAuth } from "../middleware/auth.js";

const router = Router();

router.post('/register',userRegister);
router.post('/login',userLogin);
router.get('/admin/dashboard',isAuth,isAdmin,userProfile)
router.get('/user-profile', isAuth, userProfile); 
router.get('/', findAllUsers);
router.get('/:id', findUserById);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);
router.post('/:id/deposit', depositUser);


export default router;