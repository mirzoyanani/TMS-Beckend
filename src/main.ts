import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import auth_router from "./api/auth.js";
import task_router from "./api/task.js";
import user_router from "./api/user.js";
import statistics_router from "./api/statistics.js";
import { authorize } from "./middlewares/authorization.js";
dotenv.config();

interface CorsOptions {
  origin: string;
  credentials: boolean;
}
type Port = number | string;
const PORT: Port = process.env.PORT || 9090;

const app = express();

const corsOptions: CorsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(path.resolve(), "images")));
app.use("/auth", auth_router);
app.use("/task", authorize, task_router);
app.use("/user", user_router);
app.use("/statistics", statistics_router);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
