import { QueryResult } from "pg";
import { iTechnology } from "./";

interface iProjRequest {
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: string;
  endDate?: string;
  developerId: number | null;
}

interface iProjResponse extends iProjRequest {
  id: number;
}

interface iProjDataUpdate {
  name?: string;
  description?: string;
  estimatedTime?: string;
  repository?: string;
  startDate?: string;
  endDate?: string;
  developerId?: number | null;
}

type ProjDataCreate = Pick<
  iProjResponse,
  | "name"
  | "description"
  | "estimatedTime"
  | "repository"
  | "startDate"
  | "developerId"
>;
type ProjResult = QueryResult<iProjResponse>;
type ProjRequestKeys =
  | "name"
  | "description"
  | "estimatedTime"
  | "repository"
  | "startDate"
  | "developerId";

type ProjReader = iProjResponse & iTechnology;
type ProjReaderResult = QueryResult<ProjReader>;

export {
  iProjRequest,
  iProjResponse,
  iProjDataUpdate,
  ProjDataCreate,
  ProjResult,
  ProjRequestKeys,
  ProjReader,
  ProjReaderResult,
};
