import { QueryResult } from "pg";

interface iDevInfoRequest {
  developerSince: string;
  preferredOS: string;
}

interface iDevInfoResponse extends iDevInfoRequest {
  id: number;
}

interface iDevInfoDataUpdate {
  developerSince?: string;
  preferredOS?: string;
}

type DevInfoDataCreate = Pick<
  iDevInfoResponse,
  "developerSince" | "preferredOS"
>;
type DevInfoResult = QueryResult<iDevInfoResponse>;
type DevInfoRequestKeys = "developerSince" | "preferredOS";
type DevInfoRequestOSValue = "Linux" | "Windows" | "MacOS";

export {
  iDevInfoRequest,
  iDevInfoResponse,
  iDevInfoDataUpdate,
  DevInfoDataCreate,
  DevInfoRequestKeys,
  DevInfoRequestOSValue,
  DevInfoResult
};
