import express from 'express';
import { ItemController } from './item.controller';

const router = express.Router();

router.post('/create-item', ItemController.createItem);
router.get('/:id', ItemController.getSingleItem);
router.patch('/:id', ItemController.updateItem);
router.delete('/:id', ItemController.deleteItem);

router.get('/', ItemController.getAllItems);

export const ItemRoutes = router;
