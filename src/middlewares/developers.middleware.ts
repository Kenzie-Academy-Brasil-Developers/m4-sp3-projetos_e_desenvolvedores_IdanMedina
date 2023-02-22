import { NextFunction, Request, Response } from "express";
import { DevRequestKeys } from "../interfaces/developers.interface";

const checkPostBodyRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const keys: Array<string> = Object.keys(req.body);
  const requiredKeys: Array<DevRequestKeys> = ["name", "email"];

  const checkBodyKeys: boolean = requiredKeys.every((key: string) => {
    return keys.includes(key);
  });

  if (!checkBodyKeys) {
    return res.status(400).json({
      message: `Required keys are: ${requiredKeys}`,
    });
  }

  return next();
};

export { checkPostBodyRequest };
