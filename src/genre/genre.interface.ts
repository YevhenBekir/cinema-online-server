import { Types } from 'mongoose';

export interface Collection {
  id: Types.ObjectId;
  image: string;
  title: string;
  slug: string;
}
