import express from 'express';
import { isLoggedN } from '../middlewares/isLoggedN';
import * as OrderCtrl from '../controller/orderCtrl';
const router = express.Router();

router.post('/', isLoggedN, OrderCtrl.createOrder);
router.get('/', isLoggedN, OrderCtrl.getAllOrders);
router.get('/:id', isLoggedN, OrderCtrl.getOrder);
router.put('/update/:id', isLoggedN, OrderCtrl.updateOrder);
router.get('/sales/stats', isLoggedN, OrderCtrl.getOrderState);

export default router;
