"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemRoutes = void 0;
const express_1 = __importDefault(require("express"));
const item_controller_1 = require("./item.controller");
const router = express_1.default.Router();
router.post('/create-item', item_controller_1.ItemController.createItem);
router.get('/:id', item_controller_1.ItemController.getSingleItem);
router.patch('/:id', item_controller_1.ItemController.updateItem);
router.delete('/:id', item_controller_1.ItemController.deleteItem);
router.get('/', item_controller_1.ItemController.getAllItems);
exports.ItemRoutes = router;
