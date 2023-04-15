import express from 'express';
import { isLoggedN } from '../middlewares/isLoggedN';
import * as CouponCtrl from '../controller/couponCtrl';
import isAdmin from '../middlewares/isAdmin';
const router = express.Router();

router.post('/', isLoggedN, isAdmin, CouponCtrl.createCoupon);
router.get('/', CouponCtrl.getCoupons);
router.get('/:id', CouponCtrl.getCoupon);
router.patch('/update/:id', isLoggedN, isAdmin, CouponCtrl.updateCoupons);
router.delete('/:id', isLoggedN, isAdmin, CouponCtrl.deleteCoupons);

export default router;
