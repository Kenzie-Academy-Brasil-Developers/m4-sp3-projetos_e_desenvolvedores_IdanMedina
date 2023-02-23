import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import {
  DevInfoDataCreate,
  DevInfoResult,
  iDevInfoDataUpdate,
  iDevInfoRequest,
  iDevInfoResponse,
} from "../interfaces/developer_infos.interface";
import { DevResult } from "../interfaces/developers.interface";

const createDevInfo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id: number = Number(req.params.id);

    const devDataInfoRequest: iDevInfoRequest = req.body;
    const devDataInfoCreate: DevInfoDataCreate = {
      ...devDataInfoRequest,
    };
    const { developerSince, preferredOS } = devDataInfoCreate;
    const devInfoData: DevInfoDataCreate = { developerSince, preferredOS };

    const query: string = format(
      `
          INSERT INTO
            developer_infos(%I)
          VALUES
            (%L)
          RETURNING *;
          `,
      Object.keys(devInfoData),
      Object.values(devInfoData)
    );

    const queryResult: DevInfoResult = await client.query(query);

    const newDevInfos: iDevInfoResponse = queryResult.rows[0];

    const queryCheck: string = `
        SELECT 
          * 
        FROM 
          developers 
        WHERE 
        id = $1;`;
    const queryDevConfig: QueryConfig = {
      text: queryCheck,
      values: [id],
    };
    const queryUserResult: DevResult = await client.query(queryDevConfig);
    const dev = queryUserResult.rows[0];

    if (dev.developerInfoId) {
      return res.status(400).json({
        message: "Information already exists",
      });
    }

    const queryDev: string = `
      UPDATE
        developers
      SET
        "developerInfoId" = $1
      WHERE
        id = $2
      RETURNING *;  
      `;

    const queryConfig: QueryConfig = {
      text: queryDev,
      values: [queryResult.rows[0].id, id],
    };

    const queryDevResult: DevResult = await client.query(queryConfig);
    console.log(queryDevResult);
    return res.status(201).json(newDevInfos);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateDevInfo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id: number = Number(req.params.id);

    const queryDev: string = `
        SELECT
          *
        FROM
          developers
        WHERE
          id =$1
      `;
    const queryDevConfig: QueryConfig = {
      text: queryDev,
      values: [id],
    };

    const queryDevResult: DevResult = await client.query(queryDevConfig);
    console.log(queryDevResult.rows[0]);

    const devDataInfoRequest: iDevInfoRequest = req.body;
    const devDataInfoCreate: DevInfoDataCreate = {
      ...devDataInfoRequest,
    };
    const { developerSince, preferredOS } = devDataInfoCreate;
    let devDataInfo: iDevInfoDataUpdate = { developerSince, preferredOS };

    if (!developerSince) {
      devDataInfo = { preferredOS };
    }
    if (!preferredOS) {
      devDataInfo = { developerSince };
    }

    const query: string = format(
      `
        UPDATE
          developer_infos
        SET(%I) = ROW(%L)
        WHERE
          id = $1
        RETURNING *;
          `,
      Object.keys(devDataInfo),
      Object.values(devDataInfo)
    );

    const queryConfig: QueryConfig = {
      text: query,
      values: [queryDevResult.rows[0].developerInfoId],
    };

    const queryResult: DevInfoResult = await client.query(queryConfig);
    console.log(queryResult.rows[0]);
    const patchDevInfos: iDevInfoResponse = queryResult.rows[0];

    return res.status(201).json(patchDevInfos);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export {
  createDevInfo,
  updateDevInfo
};
