import { getResponseTemplate, ResponseTemplate, hashingString } from "../lib/index.js";
import { v4 as uuid } from "uuid";
import db from "../db/index.js";
import { Request, Response } from "express";

// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

export const registerController = async (req: Request, res: Response): Promise<void> => {
  const result: ResponseTemplate = getResponseTemplate();
  try {
    const payload = req.body;
    payload.uid = uuid();

    payload.password = await hashingString(payload.password);

    await db.query(
      db.format(
        `INSERT INTO users (uid,name,surname,email,password)
          VALUES (?);`,
        [[payload.uid, payload.name, payload.surname, payload.email, payload.password]],
      ),
    );
    result.data.message = "User registered successfully";
  } catch (err: any) {
    result.meta.error = {
      code: err.code || 500,
      message: err.message || "Unknown Error",
    };
    result.meta.status = err.status || 500;
  }

  res.status(result.meta.status).json(result);
};
