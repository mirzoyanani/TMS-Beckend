import multer from "multer";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, "images/");
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, Date.now() + "--" + file.originalname.replace(/ +/g, "_"));
  },
});

const types: string[] = ["image/png", "image/jpeg", "image/jpg"];

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export default multer({ storage, fileFilter });
