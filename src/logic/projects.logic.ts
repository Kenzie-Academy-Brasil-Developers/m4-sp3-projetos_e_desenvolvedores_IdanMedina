import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import {
  iProjRequest,
  iProjResponse,
  ProjDataCreate,
  ProjReaderResult,
  ProjResult,
} from "../interfaces";

const createProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const projDataRequest: iProjRequest = req.body;
    const projDataCreate: ProjDataCreate = {
      ...projDataRequest,
    };
    const {
      name,
      description,
      estimatedTime,
      repository,
      startDate,
      developerId,
    } = projDataCreate;
    const projData: ProjDataCreate = {
      name,
      description,
      estimatedTime,
      repository,
      startDate,
      developerId,
    };

    const query: string = format(
      `
        INSERT INTO
          projects(%I)
        VALUES
          (%L)
        RETURNING *;
          `,
      Object.keys(projData),
      Object.values(projData)
    );

    const queryResult: ProjResult = await client.query(query);

    const newProj: iProjResponse = queryResult.rows[0];

    return res.status(201).json(newProj);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const readProject = async (req: Request, res: Response): Promise<Response> => {
  const id: number = Number(req.params.id);

  const query: string = `
        SELECT 
            pr.id "projectID",
            pr.name "projectName",
            pr.description "projectDescription",
            pr."estimatedTime" "projectEstimatedTime",
            pr."repository" "projectRepository",
            pr."startDate" "projectStartDate",
            pr."endDate" "projectEndDate",
            pr."developerId" "projectDeveloperId",
            pt."technologyId",
            te.name "technologyName"
        FROM
            projects_technologies pt
        FULL OUTER JOIN
            projects pr ON pt."projectId" = pr.id
        LEFT JOIN
            technologies te ON pt."technologyId" = te.id
        WHERE
            pr.id = $1
    `;

  const queryConfig: QueryConfig = {
    text: query,
    values: [id],
  };
  const queryResult: ProjResult = await client.query(queryConfig);

  return res.status(201).json(queryResult.rows[0]);
};

const readProjects = async (req: Request, res: Response): Promise<Response> => {
  const query: string = `
      SELECT 
        pr.id "projectID",
        pr.name "projectName",
        pr.description "projectDescription",
        pr."estimatedTime" "projectEstimatedTime",
        pr."repository" "projectRepository",
        pr."startDate" "projectStartDate",
        pr."endDate" "projectEndDate",
        pr."developerId" "projectDeveloperId",
        pt."technologyId",
        te.name "technologyName"
      FROM
        projects_technologies pt
      FULL OUTER JOIN
        projects pr ON pt."projectId" = pr.id
      LEFT JOIN
        technologies te ON pt."technologyId" = te.id
    `;

  const queryResult: ProjResult = await client.query(query);

  return res.status(201).json(queryResult.rows);
};

export { createProject, readProject, readProjects };
