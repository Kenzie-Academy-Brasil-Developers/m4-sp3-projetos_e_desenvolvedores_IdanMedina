import { QueryResult } from "pg";

interface iDevRequest {
  name: string;
  email: string;
}

interface iDevResponse extends iDevRequest {
  id: number;
  developerInfoId: number | null;
}

type DevDataCreate = Pick<iDevResponse, "name" | "email">;
type DevResult = QueryResult<iDevResponse>;
type DevRequestKeys = "name" | "email";

interface iDevInfoRequest {
  developerSince: string;
  preferredOS: string;
}

interface iDevInfoResponse extends iDevInfoRequest {
  id: number;
}

type DevInfoDataCreate = Pick<
  iDevInfoResponse,
  "developerSince" | "preferredOS"
>;
type DevInfoResult = QueryResult<iDevInfoResponse>;
type DevInfoRequestKeys = "developerSince" | "preferredOS";
type DevInfoRequestOSValue = "Linux" | "Windows" | "MacOS";

type DevReader = iDevResponse & iDevInfoResponse;
type DevReaderResult = QueryResult<DevReader>;

export {
  iDevRequest,
  iDevResponse,
  DevDataCreate,
  DevResult,
  DevRequestKeys,
  iDevInfoRequest,
  iDevInfoResponse,
  DevInfoDataCreate,
  DevInfoRequestKeys,
  DevInfoRequestOSValue,
  DevInfoResult,
  DevReader,
  DevReaderResult,
};
