import { AuthenticatedRequest } from "./middleware.js";
import { User } from "./model.js";
import TryCatch from "./TryCatch.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Playlist } from "./playlistmodel.js";
import { rateLimit } from "./ratelimt.js";




export const registerUser = TryCatch(async (req, res) => {

  const ip = (
  req.headers["x-forwarded-for"] as string
)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";


  const { success, retryAfter } = await rateLimit(ip, 5, 3*60); // 5 requests per 60 sec

  if (!success) {
  res.status(429).json({
    message: `Too many login attempts. Try again in ${retryAfter} seconds.`,
  });
  return;
}


  const { name, email, password } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    res.status(400).json({
      message: "User Already exists",
    });

    return;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, {
    expiresIn: "7d",
  });

  res
  .status(201)
  .cookie("token", token, {
    httpOnly: true,
    secure: true, // only HTTPS in prod
    sameSite: "none", // or 'none' if frontend and backend are on different domains
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
  .json({
    success: true,
    message:"User Registered",
    user,
  });
});

export const loginUser = TryCatch(async (req, res) => {

 const ip = (
  req.headers["x-forwarded-for"] as string
)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";


  const { success, retryAfter } = await rateLimit(ip, 5, 3*60); // 5 requests per 60 sec

  if (!success) {
  res.status(429).json({
    message: `Too many login attempts. Try again in ${retryAfter} seconds.`,
  });
  return;
}

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({
      message: "User not exists",
    });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(400).json({
      message: "Invalid Password",
    });
    return;
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, {
    expiresIn: "7d",
  });

  res
  .status(200)
  .cookie("token", token, {
    httpOnly: true,
    secure: true, // only HTTPS in prod
    sameSite: "none", // or 'none' if frontend and backend are on different domains
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
  .json({
    success: true,
    message:"Logged In",
    user,
  });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  console.log(user);

  res.json(user);
});

export const addSongToPlaylist = TryCatch(async (req: AuthenticatedRequest, res: any) => {
  const { playlistId, songId } = req.params;
  const pl = await Playlist.findOne({ _id: playlistId, user: req.user!._id });
  if (!pl) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  const index = pl.songs.indexOf(songId);
  if (index === -1) {
    pl.songs.push(songId);
    await pl.save();
    return res.json({ message: "Song added", playlist: pl });
  } else {
    pl.songs.splice(index, 1);
    await pl.save();
    return res.json({ message: "Song removed", playlist: pl });
  }
});

export const logout = TryCatch(async(requestAnimationFrame,res)=>{
  res.clearCookie("token", {
    httpOnly: true,   // Make sure cookie is not accessible via JavaScript
    secure: true,  // Only send over HTTPS in production
    sameSite: "none", // Prevent cross-site requests
    path: "/",
  });

  // Send a success message
  res.status(200).json({
    message: "Logged out successfully",
  });

});

export const createPlaylist = TryCatch(async (req: AuthenticatedRequest, res: any) => {
  const { name } = req.body;
  const userId = req.user!._id;
  const existing = await Playlist.findOne({ user: userId, name });
  if (existing) {
    return res.status(400).json({ message: "Playlist already exists" });
  }

  const pl = await Playlist.create({ name, user: userId, songs: [] });
  res.status(201).json(pl);
});

// Get all playlists for the authenticated user
export const getPlaylists = TryCatch(async (req: AuthenticatedRequest, res: any) => {
  const userId = req.user!._id;
  const lists = await Playlist.find({ user: userId });
  res.json(lists);
});