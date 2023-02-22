import { QueryResult } from "pg";

interface iDevRequest {
  name: string;
  email: string;
}

interface iDevResponse extends iDevRequest {
  id: number;
}

type DevDataCreate = Pick<iDevResponse, "name" | "email">;
type DevResult = QueryResult<iDevResponse>;
type DevRequestKeys = "name" | "email";

export { iDevRequest, iDevResponse, DevDataCreate, DevResult, DevRequestKeys };
