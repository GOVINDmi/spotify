import express from "express";
import {
  createPlaylist,
  getPlaylists,
  addSongToPlaylist,
  loginUser,
  myProfile,
  registerUser,
  logout
} from "./controller.js";
import { isAuth } from "./middleware.js";


const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.post("/user/logout", logout);
router.get("/user/me", isAuth, myProfile);
router.post("/playlists", isAuth, createPlaylist);
router.get("/playlists", isAuth, getPlaylists);
router.post("/playlists/:playlistId/songs/:songId", isAuth, addSongToPlaylist);

export default router;