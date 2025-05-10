// playlist.model.ts]
import mongoose, { Document, Schema,Types } from "mongoose";
export interface IPlaylist extends Document {
    name: string;
    user: Types.ObjectId;
    songs: string[];
    createdAt: Date;
  }
  
  const PlaylistSchema = new Schema<IPlaylist>(
    {
      name: { type: String, required: true },
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      songs: [{ type: String, required: true }],
    },
    { timestamps: true }
  );
  
  export const Playlist = mongoose.model<IPlaylist>("Playlist", PlaylistSchema);
  