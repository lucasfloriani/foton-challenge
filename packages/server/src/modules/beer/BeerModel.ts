import mongoose, { Document, Model } from 'mongoose';

const Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      description: 'User reference from users collection',
      required: true,
    },
    name: {
      type: String,
      description: 'Beer name',
      index: true,
      required: true,
    },
    description: {
      type: String,
      description: 'Beer description',
      required: true,
    },
    image: {
      type: String,
      description: 'Beer image',
      required: true,
    },
    bitterness: {
      type: Number,
      description: 'Beer bitterness',
      required: true,
    },
    coloring: {
      type: Number,
      description: 'Beer coloring',
      required: true,
    },
    volumetry: {
      type: String,
      description: 'Beer volumetry',
      required: true,
    },
    style: {
      type: String,
      description: 'Beer style',
      required: true,
    },
    idealTemperature: {
      type: [Number, Number],
      description: 'Beer ideal temperature',
      required: true,
    },
    alcoholContent: {
      type: Number,
      description: 'Beer alcohol content value in percent',
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'Beer',
  },
);

Schema.index({ title: 'name', description: 'description' });
Schema.index({ user: 'user' });

export interface IBeer extends Document {
  user: string;
  name: string;
  description: string;
  image: string;
  bitterness: number;
  coloring: number;
  volumetry: string;
  style: string;
  idealTemperature: [number, number];
  alcoholContent: number;
  createdAt: Date;
  updatedAt: Date;
}

const BeerModel: Model<IBeer> = mongoose.model<IBeer, Model<IBeer>>('Beer', Schema);

export default BeerModel;
