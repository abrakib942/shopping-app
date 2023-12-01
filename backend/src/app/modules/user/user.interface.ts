/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type IUser = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  items: Types.ObjectId[];
};

export type UserModel = {
  isUserExist(
    email: string
  ): Promise<Pick<IUser, 'email' | 'password' | '_id'>>;
  // isPasswordMatched(
  //   givenPassword: string,
  //   savedPassword: string
  // ): Promise<boolean>;
} & Model<IUser>;

// export type UserModel = Model<IUser, Record<string, unknown>>;
