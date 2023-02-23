import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import {
  iProjRequest,
  iProjResponse,
  ProjDataCreate,
  ProjRequestKeys,
  ProjResult,
} from "../interfaces";
import { iProjDataUpdate } from "../interfaces/projects.interface";

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

const updateProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id: number = Number(req.params.id);
    const projDataRequest: iProjRequest = req.body;
    const projDataCreate: ProjDataCreate = {
      ...projDataRequest,
    };

    const keys: Array<string> = Object.keys(req.body);
    const requiredKeys: Array<ProjRequestKeys> = [
      "name",
      "description",
      "estimatedTime",
      "repository",
      "startDate",
      "developerId",
    ];
    for (let data in projDataRequest){

    }
   
    const {
      name,
      description,
      estimatedTime,
      repository,
      startDate,
      developerId,
    } = projDataCreate;
    let projData: ProjDataCreate = {
      name,
      description,
      estimatedTime,
      repository,
      startDate,
      developerId,
    };

    const query: string = format(
      `
      UPDATE
        developers
      SET(%I) = ROW(%L)
      WHERE
        id = $1
      RETURNING *;
        `,
      Object.keys(id),
      Object.values(id)
    );

    const queryConfig: QueryConfig = {
      text: query,
      values: [id],
    };
    const queryResult: ProjResult = await client.query(queryConfig);

    const patchDev: iProjResponse = queryResult.rows[0];

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

const deleteProject = async (req: Request, res: Response): Promise<Response> => {
  const id: number = Number(req.params.id);
  const query: string = `
    DELETE FROM
      projects
    WHERE
      id = $1
  `;
  const queryConfig: QueryConfig = {
    text: query,
    values: [id],
  };
  const queryResult: ProjResult = await client.query(queryConfig);

  return res.status(201).json();
};

export { createProject, readProject, readProjects, deleteProject };
