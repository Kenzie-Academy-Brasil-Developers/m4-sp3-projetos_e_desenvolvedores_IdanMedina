import { Request, Response } from "express";
import format from "pg-format";
import { client } from "../database";
import {
  DevDataCreate,
  DevResult,
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
    if(error.message.includes('duplicate key value violates unique constraint "developers_email_key"')){
      return res.status(409).json({
        message: "Email already exists"
      })
    }
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const readDevs = async (req: Request, res: Response): Promise<Response> => {


  return res.status(201).json();
}

export { createDev };
