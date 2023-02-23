import { NextFunction, Request, Response } from "express";
import { DevInfoRequestKeys, DevInfoRequestOSValue } from "../interfaces";

const checkPatchDevInfoBodyRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const keys: Array<string> = Object.keys(req.body);
  const OSValues: Array<string> = Object.values(req.body);

  const requiredKeys: Array<DevInfoRequestKeys> = [
    "developerSince",
    "preferredOS",
  ];
  const requiredOSValues: Array<DevInfoRequestOSValue> = [
    "Linux",
    "Windows",
    "MacOS",
  ];

  const checkBodyKeys: boolean = requiredKeys.some((key: string) => {
    return keys.includes(key);
  });

  if (!checkBodyKeys) {
    return res.status(400).json({
      message: `Required keys, at least one: ${requiredKeys}`,
    });
  }

  if (req.body.preferredOS) {
    const checkOSValues: boolean = requiredOSValues.some((value: string) => {
      return OSValues.includes(value);
    });

    if (!checkOSValues) {
      return res.status(400).json({
        message: `Required preferred Operational Systems are, at least one: ${requiredOSValues}`,
      });
    }
  }

  return next();
};

const checkPostBodyDevInfoRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const keys: Array<string> = Object.keys(req.body);
  const OSValues: Array<string> = Object.values(req.body);

  const requiredKeys: Array<DevInfoRequestKeys> = [
    "developerSince",
    "preferredOS",
  ];
  const requiredOSValues: Array<DevInfoRequestOSValue> = [
    "Linux",
    "Windows",
    "MacOS",
  ];

  const checkBodyKeys: boolean = requiredKeys.every((key: string) => {
    return keys.includes(key);
  });
  const checkOSValues: boolean = requiredOSValues.some((value: string) => {
    return OSValues.includes(value);
  });

  if (!checkBodyKeys) {
    return res.status(400).json({
      message: `Required keys are: ${requiredKeys}`,
    });
  }

  if (!checkOSValues) {
    return res.status(400).json({
      message: `Required preferred Operational Systems are: ${requiredOSValues}`,
    });
  }

  return next();
};

export { checkPostBodyDevInfoRequest, checkPatchDevInfoBodyRequest };
