import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import {
  DevDataCreate,
  DevReaderResult,
  DevResult,
  iDevDataUpdate,
  iDevRequest,
  iDevResponse,
} from "../interfaces/developers.interface";

const createDev = async (req: Request, res: Response): Promise<Response> => {
  try {
    const devDataRequest: iDevRequest = req.body;
    const devDataCreate: DevDataCreate = {
      ...devDataRequest,
    };
    const { name, email } = devDataCreate;
    const devData: DevDataCreate = { name, email };

    const query: string = format(
      `
      INSERT INTO
        developers(%I)
      VALUES
        (%L)
      RETURNING *;
        `,
      Object.keys(devData),
      Object.values(devData)
    );

    const queryResult: DevResult = await client.query(query);

    const newDev: iDevResponse = queryResult.rows[0];

    return res.status(201).json(newDev);
  } catch (error: any) {
    if (
      error.message.includes(
        'duplicate key value violates unique constraint "developers_email_key"'
      )
    ) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const readDev = async (req: Request, res: Response): Promise<Response> => {
  const id: number = Number(req.params.id);

  const query: string = `
    SELECT 
      dv.id "developerID",
      dv.name "developerName",
      dv.email "developerEmail",
      dv."developerInfoId",
      di."developerSince" "developerInfoDeveloperSince",
      di."preferredOS" "developerInfoPreferredOS"
    FROM
      developers dv
    LEFT JOIN
      developer_infos di ON dv."developerInfoId" = di.id
    WHERE
      dv.id = $1
  `;

  const queryConfig: QueryConfig = {
    text: query,
    values: [id],
  };
  const queryResult: DevReaderResult = await client.query(queryConfig);

  return res.status(201).json(queryResult.rows[0]);
};

const readDevs = async (req: Request, res: Response): Promise<Response> => {
  const query: string = `
    SELECT 
      dv.id "developerID",
      dv.name "developerName",
      dv.email "developerEmail",
      dv."developerInfoId",
      di."developerSince" "developerInfoDeveloperSince",
      di."preferredOS" "developerInfoPreferredOS"
    FROM
      developers dv
    LEFT JOIN
      developer_infos di ON dv."developerInfoId" = di.id
  `;

  const queryResult: DevResult = await client.query(query);

  return res.status(201).json(queryResult.rows);
};

const updateDev = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id: number = Number(req.params.id);
    const devDataRequest: iDevRequest = req.body;
    const devDataCreate: DevDataCreate = {
      ...devDataRequest,
    };
    const { name, email } = devDataCreate;
    let devData: iDevDataUpdate = { name, email };

    if (!name) {
      devData = { email };
    }
    if (!email) {
      devData = { name };
    }

    const query: string = format(
      `
      UPDATE
        developers
      SET(%I) = ROW(%L)
      WHERE
        id = $1
      RETURNING *;
        `,
      Object.keys(devData),
      Object.values(devData)
    );

    const queryConfig: QueryConfig = {
      text: query,
      values: [id],
    };
    const queryResult: DevResult = await client.query(queryConfig);

    const patchDev: iDevResponse = queryResult.rows[0];

    return res.status(201).json(patchDev);
  } catch (error: any) {
    if (
      error.message.includes(
        'duplicate key value violates unique constraint "developers_email_key"'
      )
    ) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteDev = async (req: Request, res: Response): Promise<Response> => {
  const id: number = Number(req.params.id);
  const query: string = `
    DELETE FROM
      developers
    WHERE
      id = $1
  `;
  const queryConfig: QueryConfig = {
    text: query,
    values: [id],
  };
  const queryResult: DevResult = await client.query(queryConfig);

  return res.status(201).json();
};

export { createDev, readDevs, readDev, deleteDev, updateDev };
