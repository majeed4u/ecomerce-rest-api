import express from 'express';
import { isLoggedN } from '../middlewares/isLoggedN';
import * as ReviewCtrl from '../controller/reviewCtrl';
const router = express.Router();

router.post('/:productId', isLoggedN, ReviewCtrl.createReview);
export default router;
