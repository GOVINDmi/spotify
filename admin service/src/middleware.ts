import { NextFunction, Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import cookie from "cookie";

dotenv.config();

interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  playlist: string[];
}

interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(403).json({ message: "Please Login" });
      return;
    }
    console.log(token);
    const { data } = await axios.get(`${process.env.USER_URL}/api/v1/user/me`, {
      headers: { cookie: `token=${token}` }, // pass token cookie to user service
    });

    req.user = data;
    next();
  } catch (error) {
    res.status(403).json({ message: "Please Login" });
  }
};

//multer setup
import multer from "multer";

const storage = multer.memoryStorage();

const uploadFile = multer({ storage }).single("file");

export default uploadFile;
