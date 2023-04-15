import express from 'express';
import { isLoggedN } from '../middlewares/isLoggedN';
import * as UserCtrl from '../controller/usersCtrl';
const router = express.Router();

router.post('/register', UserCtrl.registerUser);
router.post('/login', UserCtrl.loginUser);
router.get('/', isLoggedN, UserCtrl.getUserProfile);
router.patch('/update/shipping', isLoggedN, UserCtrl.updateShippingAddress);

export default router;
