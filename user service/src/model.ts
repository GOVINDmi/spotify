import mongoose, { Document, Schema,Types } from "mongoose";

// model.ts
export interface IPlaylist {
  _id: Types.ObjectId;
  name: string;
  songs: string[];    // array of song IDs
  createdAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  playlists: IPlaylist[];
}

const playlistSchema = new Schema<IPlaylist>(
  {
    name: { type: String, required: true },
    songs: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const userSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
    playlists: [playlistSchema],
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
