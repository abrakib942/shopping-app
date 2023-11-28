import { NextFunction, Request, Response } from 'express';
import { User } from './user.model';
import pick from '../../../shared/pick';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { SortOrder } from 'mongoose';

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = pick(req.query, ['searchTerm', 'name', 'email']);

    const { searchTerm, ...filtersData } = filters;

    const paginationOptions: Partial<IPaginationOptions> = pick(req.query, [
      'page',
      'limit',
      'sortBy',
      'sortOrder',
    ]);

    const andConditions = [];

    const itemsSearchableFields = ['name', 'email'];

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

    const result = await User.find(whereCondition)
      .populate('items')
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(whereCondition);

    res.status(200).json({
      success: true,
      message: 'users retrieved successfully!',

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
const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await User.findById(id).populate('items').exec();

    res.status(200).json({
      success: true,
      message: 'user retrieved successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const result = await User.findOneAndUpdate({ _id: id }, updatedData, {
      new: true,
      runValidators: true,
    })
      .populate('items')
      .exec();

    res.status(200).json({
      success: true,
      message: 'user updated successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'user deleted successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
