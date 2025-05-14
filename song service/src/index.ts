import express from "express";
import doetnv from "dotenv";
import songRoutes from "./route.js";
import redis from "redis";
import cors from "cors";
import cookieParser from "cookie-parser";

doetnv.config();

export const redisClient = redis.createClient({
  password: process.env.Redis_Password,
  socket: {
    host: "redis-13897.c212.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 13897,
  },
});

redisClient
  .connect()
  .then(() => console.log("connected to redis"))
  .catch(console.error);

const app = express();

app.use(cors({
  origin: 'https://spotify-w7e.pages.dev',
  credentials: true
}));
app.use(cookieParser());

app.use("/api/v1", songRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
