import { NextFunction, Request, Response } from 'express';
import { Item } from './item.model';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import pick from '../../../shared/pick';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { SortOrder } from 'mongoose';
import { User } from '../user/user.model';

const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization as string;

    const verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const { userId } = verifiedToken;

    const { name } = req.body;
    const result = await (
      await Item.create({ created_by: userId, name })
    ).populate('created_by');

    // Save the item's ID to the user's 'items' array
    await User.findByIdAndUpdate(userId, { $push: { items: result._id } });

    // const { ...item } = req.body;
    // const result = await (await Item.create(item)).populate('created_by');

    res.status(200).json({
      success: true,
      message: 'item created successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = pick(req.query, ['searchTerm', 'name', 'created_by']);

    const { searchTerm, ...filtersData } = filters;

    const paginationOptions: Partial<IPaginationOptions> = pick(req.query, [
      'page',
      'limit',
      'sortBy',
      'sortOrder',
    ]);

    const andConditions = [];

    const itemsSearchableFields = ['name', 'created_by'];

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

    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(paginationOptions);

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder as SortOrder;
    }

    const whereCondition =
      andConditions.length > 0 ? { $and: andConditions } : {};

    const result = await Item.find(whereCondition)
      .populate('created_by')
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    const total = await Item.countDocuments(whereCondition);

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
  } catch (error) {
    next(error);
  }
};

const getSingleItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await Item.findById(id).populate('created_by');

    res.status(200).json({
      success: true,
      message: 'item retrieved successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await Item.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    }).populate('created_by');

    res.status(200).json({
      success: true,
      message: 'item updated successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await Item.findByIdAndDelete(id).populate('created_by');

    res.status(200).json({
      success: true,
      message: 'item deleted successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const ItemController = {
  createItem,
  getAllItems,
  getSingleItem,
  updateItem,
  deleteItem,
};
