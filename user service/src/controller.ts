import { AuthenticatedRequest } from "./middleware.js";
import { User } from "./model.js";
import TryCatch from "./TryCatch.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export const registerUser = TryCatch(async (req, res) => {
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
    secure: false, // only HTTPS in prod
    sameSite: "lax", // or 'none' if frontend and backend are on different domains
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
  .json({
    success: true,
    message:"User Registered",
    user,
  });
});

export const loginUser = TryCatch(async (req, res) => {
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
    secure: false, // only HTTPS in prod
    sameSite: "lax", // or 'none' if frontend and backend are on different domains
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

  res.json(user);
});

export const addToPlaylist = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        message: "NO user with this id",
      });
      return;
    }

    if (user?.playlist.includes(req.params.id)) {
      const index = user.playlist.indexOf(req.params.id);

      user.playlist.splice(index, 1);

      await user.save();

      res.json({
        message: " Removed from playlist",
      });
      return;
    }

    user.playlist.push(req.params.id);

    await user.save();

    res.json({
      message: "Added to PlayList",
    });
  }
);


export const logout = TryCatch(async(requestAnimationFrame,res)=>{
  res.clearCookie("token", {
    httpOnly: true,   // Make sure cookie is not accessible via JavaScript
    secure: process.env.NODE_ENV === "production",  // Only send over HTTPS in production
    sameSite: "lax", // Prevent cross-site requests
    path: "/",
  });

  // Send a success message
  res.status(200).json({
    message: "Logged out successfully",
  });

});

