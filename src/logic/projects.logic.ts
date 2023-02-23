import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import {
  iProjRequest,
  iProjResponse,
  ProjDataCreate,
  ProjResult,
} from "../interfaces/projects.interface";

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

const readProjects = async (req: Request, res: Response): Promise<Response> => {
  const query: string = `
      SELECT 
        pr.id "projectID",
        pr.name "projectName",
        pr.description "projectDescription",
        pr."estimatedTime" "projectEstimatedTime",
        pr."repository" "developerRepository",
        pr."startDate" "developerStartDate",
        pr."endDate" "developerEndDate",
        pr."developerId" "developerDeveloperId",
        pt."technologyId" "developerDeveloperId",
        te.name "technologyName"
      FROM
        projects_technologies pt
      FULL OUTER JOIN
        projects pr ON pt."projectId" = pr.id
      FULL OUTER JOIN
        technologies te ON pt."technologyId" = te.id
    `;

  const queryResult: ProjResult = await client.query(query);

  return res.status(201).json(queryResult.rows);
};

export { createProject, readProjects };
