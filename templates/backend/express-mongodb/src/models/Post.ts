import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content?: string;
  published: boolean;
  authorId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String },
    published: { type: Boolean, default: false },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Post = mongoose.model<IPost>('Post', PostSchema);
