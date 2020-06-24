import bcrypt from 'bcrypt';
import mongoose, { Document, Model } from 'mongoose';

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      description: 'User name',
      index: true,
      required: true,
    },
    email: {
      type: String,
      email: 'User email',
      required: true,
    },
    password: {
      type: String,
      description: 'User password',
      index: true,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'User',
  },
);

Schema.index({ name: 'name' });
Schema.index({ email: 'email' });

Schema.pre<IUser>('save', function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    return next(err);
  }
});

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserModel: Model<IUser> = mongoose.model<IUser, Model<IUser>>('User', Schema);

export default UserModel;
