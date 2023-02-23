import { QueryResult } from "pg";
import { iDevInfoResponse } from "./developer_infos.interface";

interface iDevRequest {
  name: string;
  email: string;
}

interface iDevResponse extends iDevRequest {
  id: number;
  developerInfoId: number | null;
}

interface iDevDataUpdate {
  name?: string;
  email?: string;
}

type DevDataCreate = Pick<iDevResponse, "name" | "email">;
type DevResult = QueryResult<iDevResponse>;
type DevRequestKeys = "name" | "email";

type DevReader = iDevResponse & iDevInfoResponse;
type DevReaderResult = QueryResult<DevReader>;

export {
  iDevRequest,
  iDevResponse,
  iDevDataUpdate,
  DevDataCreate,
  DevResult,
  DevRequestKeys,
  DevReader,
  DevReaderResult,
};
