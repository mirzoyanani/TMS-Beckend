import { Response, Request, NextFunction } from "express";
import validationSchemas from "./schema.js";
import { _VALIDATION_ERROR_ } from "../../helpers/err-codes.js";

const validator = (type: string) => (req: Request, res: Response, next: NextFunction) => {
  if (type in validationSchemas) {
    const validationResult = validationSchemas[type].validate(req.body);
    if (validationResult.error) {
      res.status(_VALIDATION_ERROR_.status).json({
        meta: {
          error: { code: _VALIDATION_ERROR_.code, message: _VALIDATION_ERROR_.message },
          status: _VALIDATION_ERROR_.status,
        },
        data: {},
      });
    } else {
      next();
    }
  }
};

export default validator;
