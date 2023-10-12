import { Response } from "express";
import { getResponseTemplate } from "../lib/index.js";
import { ResponseTemplate } from "../lib/index.js";
import { CustomRequest } from "../lib/index.js";
import { getUserInfo } from "../db/user.js";

export const getUserInfoController = async (req: CustomRequest, res: Response) => {
  const result: ResponseTemplate = getResponseTemplate();
  try {
    const data = await getUserInfo(req.decoded);
    result.data = { data };
  } catch (err: any) {
    result.meta.error = {
      code: err.code || err.errCode || 500,
      message: err.message || err.errMessage || "Unknown Error",
    };
    result.meta.status = err.status || err.statusCode || 500;
  }
  res.status(result.meta.status).json(result);
};

// export const editUserInfoController = async (req: Request, res: Response) => {
//   const result: ResponseTemplate = getResponseTemplate();
//   try {
//     const { token } = req.headers;
//     if (!token) {
//       throw _TOKEN_IS_WRONG_;
//     }
//     const decoded: any = jwt.verify(token as string, process.env.SECRET_KEY as string);

//     result.data.message = "Info edited successfully";
//   } catch (err: any) {
//     result.meta.error = {
//       code: err.code || err.errCode || 500,
//       message: err.message || err.errMessage || "Unknown Error",
//     };
//     result.meta.status = err.status || err.statusCode || 500;
//   }
//   res.status(result.meta.status).json(result);
// };
