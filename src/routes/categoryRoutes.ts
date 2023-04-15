import express from 'express';
import { isLoggedN } from '../middlewares/isLoggedN';
import * as CategoryCtrl from '../controller/categoryCtrl';
import catUpload from '../config/categoryUpload';
const router = express.Router();

router.post(
  '/',
  isLoggedN,
  catUpload.single('file'),
  CategoryCtrl.createCategory
);
router.get('/', CategoryCtrl.getAllCategories);
router.get('/:id', CategoryCtrl.getSingleCategory);
router.patch('/:id', isLoggedN, CategoryCtrl.updateCategory);
router.delete('/:id', isLoggedN, CategoryCtrl.deleteCategory);

export default router;
