import express from 'express';
import * as ColorCtrl from '../controller/colorCtrl';
import { isLoggedN } from '../middlewares/isLoggedN';
import isAdmin from '../middlewares/isAdmin';
const router = express.Router();

router.post('/', isLoggedN, isAdmin, ColorCtrl.createColor);
router.get('/', ColorCtrl.getAllColors);
router.get('/:id', ColorCtrl.getSingleColor);
router.patch('/:id', isLoggedN, isAdmin, ColorCtrl.updateColor);
router.delete('/:id', isLoggedN, isAdmin, ColorCtrl.deleteColor);

export default router;
