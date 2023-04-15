import express from 'express';
import { isLoggedN } from '../middlewares/isLoggedN';
import * as BrandCtrl from '../controller/brandCtrl';
import isAdmin from '../middlewares/isAdmin';
const router = express.Router();

router.post('/', isLoggedN, isAdmin, BrandCtrl.createBrand);
router.get('/', BrandCtrl.getAllBrand);
router.get('/:id', BrandCtrl.getSingleBrand);
router.patch('/:id', isLoggedN, isAdmin, BrandCtrl.updateBrand);
router.delete('/:id', isLoggedN, isAdmin, BrandCtrl.deleteBrand);

export default router;
