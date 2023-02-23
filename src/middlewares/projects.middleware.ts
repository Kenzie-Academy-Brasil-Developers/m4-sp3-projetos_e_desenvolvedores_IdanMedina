import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { ProjRequestKeys } from "../interfaces/projects.interface";

const checkPostProjBodyRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const keys: Array<string> = Object.keys(req.body);
  const requiredKeys: Array<ProjRequestKeys> = [
    "name",
    "description",
    "estimatedTime",
    "repository",
    "startDate",
    "developerId",
  ];

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

const checkIfDevIdToProj = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = Number(req.body.developerId);

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
      message: "Developer ID not found",
    });
  }
  return next();
};

export { checkPostProjBodyRequest, checkIfDevIdToProj };
