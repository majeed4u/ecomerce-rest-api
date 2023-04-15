import express from 'express';
import { isLoggedN } from '../middlewares/isLoggedN';
import * as ProductCtrl from '../controller/productsCtrl';
import proUpload from '../config/productUpload';
import isAdmin from '../middlewares/isAdmin';

const router = express.Router();

router.post(
  '/',
  isLoggedN,
  isAdmin,
  proUpload.array('files'),
  ProductCtrl.createProduct
);
router.get('/', ProductCtrl.getAllProducts);
router.get('/:id', ProductCtrl.getProduct);
router.patch('/:id', isLoggedN, isAdmin, ProductCtrl.updateProduct);
router.delete('/:id', isLoggedN, isAdmin, ProductCtrl.deleteProduct);

export default router;
