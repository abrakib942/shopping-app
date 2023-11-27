import { Model, Types } from 'mongoose';

export type IUser = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
};

export type UserModel = Model<IUser, Record<string, unknown>>;
