import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import studentRouter from "./routes/studentRouter.js";
import hodRouter from "./routes/hodRouter.js";
import claimRouter from "./routes/claimRouter.js";
import authRouter from "./routes/authRouter.js";
import courseRouter from "./routes/courseRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_ONLINE_URL;
// const DB_URL = process.env.DB_URL;

app.use(cors());
app.use(express.json());

app.use("/api/v1/student", studentRouter);
app.use("/api/v1/hod", hodRouter);
app.use("/api/v1/claim", claimRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/course", courseRouter);


app.use((_req, res) =>
  res.status(404).json({ success: false, message: "Route not found." }),
);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("+------[ Connected to the database ]------+");
    app.listen(PORT, () => {
      console.log(`Server is running on  http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
