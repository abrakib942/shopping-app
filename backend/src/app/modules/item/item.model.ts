import { Schema, Types, model } from 'mongoose';
import { IUser } from '../user/user.interface';

export type IITEM = {
  _id: Types.ObjectId;
  name: string;
  created_by: Types.ObjectId | IUser;
};

const itemSchema = new Schema<IITEM>(
  {
    name: {
      type: String,
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Item = model<IITEM>('Item', itemSchema);
