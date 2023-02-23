import { QueryResult } from "pg";
import { iDevInfoResponse } from "./developer_infos.interface";

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

interface iDevDataUpdate {
  name?: string;
  email?: string;
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

type DevReader = iProjResponse & iDevInfoResponse;
type DevReaderResult = QueryResult<DevReader>;

export {
  iProjRequest,
  iProjResponse,
  iDevDataUpdate,
  ProjDataCreate,
  ProjResult,
  ProjRequestKeys,
  DevReader,
  DevReaderResult,
};
