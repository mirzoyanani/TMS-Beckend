import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import setupRoutes from "./api/index.js";
import { SendMessages } from "./controllers/notification.js";

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

setupRoutes(app);
SendMessages();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
