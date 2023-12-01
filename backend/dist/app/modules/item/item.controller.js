"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemController = void 0;
const item_model_1 = require("./item.model");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const user_model_1 = require("../user/user.model");
const createItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
        const { userId } = verifiedToken;
        const { name } = req.body;
        const result = yield (yield item_model_1.Item.create({ created_by: userId, name })).populate('created_by');
        // Save the item's ID to the user's 'items' array
        yield user_model_1.User.findByIdAndUpdate(userId, { $push: { items: result._id } });
        // const { ...item } = req.body;
        // const result = await (await Item.create(item)).populate('created_by');
        res.status(200).json({
            success: true,
            message: 'item created successfully!',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, ['searchTerm', 'name', 'created_by']);
        const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
        const paginationOptions = (0, pick_1.default)(req.query, [
            'page',
            'limit',
            'sortBy',
            'sortOrder',
        ]);
        const andConditions = [];
        const itemsSearchableFields = ['name'];
        if (searchTerm) {
            andConditions.push({
                $or: itemsSearchableFields.map(field => ({
                    [field]: { $regex: searchTerm, $options: 'i' },
                })),
            });
        }
        if (Object.keys(filtersData).length) {
            andConditions.push({
                $and: Object.entries(filtersData).map(([field, value]) => ({
                    [field]: { $regex: value, $options: 'i' },
                })),
            });
        }
        const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
        const sortConditions = {};
        if (sortBy && sortOrder) {
            sortConditions[sortBy] = sortOrder;
        }
        const whereCondition = andConditions.length > 0 ? { $and: andConditions } : {};
        const result = yield item_model_1.Item.find(whereCondition)
            .populate('created_by')
            .sort(sortConditions)
            .skip(skip)
            .limit(limit);
        const total = yield item_model_1.Item.countDocuments(whereCondition);
        res.status(200).json({
            success: true,
            message: 'Items retrieved successfully!',
            data: {
                meta: {
                    page,
                    limit,
                    total,
                },
                data: result,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield item_model_1.Item.findById(id).populate('created_by');
        res.status(200).json({
            success: true,
            message: 'item retrieved successfully!',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield item_model_1.Item.findByIdAndUpdate({ _id: id }, req.body, {
            new: true,
            runValidators: true,
        }).populate('created_by');
        res.status(200).json({
            success: true,
            message: 'item updated successfully!',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield item_model_1.Item.findByIdAndDelete(id).populate('created_by');
        res.status(200).json({
            success: true,
            message: 'item deleted successfully!',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.ItemController = {
    createItem,
    getAllItems,
    getSingleItem,
    updateItem,
    deleteItem,
};
