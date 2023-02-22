import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { DevInfoRequestKeys, DevInfoRequestOSValue, DevRequestKeys } from "../interfaces/developers.interface";

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

const checkPatchDevBodyRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const keys: Array<string> = Object.keys(req.body);
  const requiredKeys: Array<DevRequestKeys> = ["name", "email"];

  const checkBodyKeys: boolean = requiredKeys.some((key: string) => {
    return keys.includes(key);
  });

  if (!checkBodyKeys) {
    return res.status(400).json({
      message: `Required keys, at least one: ${requiredKeys}`,
    });
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
  
  const requiredKeys: Array<DevInfoRequestKeys> = ["developerSince", "preferredOS"];
  const requiredOSValues: Array<DevInfoRequestOSValue> = ["Linux", "Windows", "MacOS"];

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

const checkIfDevIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = Number(req.params.id);

  const query: string = `
        SELECT
            *
        FROM
            developers
        WHERE
            id= $1;
    `;

  const queryConfig: QueryConfig = {
    text: query,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);
  if (queryResult.rows.length === 0) {
    return res.status(404).json({
      message: "Developer not found",
    });
  }
  return next();
};

export { checkPostBodyRequest, checkPostBodyDevInfoRequest, checkPatchDevBodyRequest, checkIfDevIdExists };
