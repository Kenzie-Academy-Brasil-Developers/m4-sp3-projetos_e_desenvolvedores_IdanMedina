import express, { Application } from "express";
import { startDatabase } from "./database";
import {
  createDev,
  createDevInfo,
  deleteDev,
  readDev,
  readDevs,
  updateDev,
  updateDevInfo,
} from "./logic/developers.logic";
import {
  checkIfDevIdExists,
  checkPatchDevBodyRequest,
  checkPatchDevInfoBodyRequest,
  checkPostBodyDevInfoRequest,
  checkPostBodyRequest,
} from "./middlewares/developers.middleware";

const app: Application = express();
app.use(express.json());

app.post("/developers", checkPostBodyRequest, createDev);
app.post(
  "/developers/:id/infos",
  checkIfDevIdExists,
  checkPostBodyDevInfoRequest,
  createDevInfo
);
app.get("/developers", readDevs);
app.get("/developers/:id", checkIfDevIdExists, readDev);
app.patch(
  "/developers/:id",
  checkIfDevIdExists,
  checkPatchDevBodyRequest,
  updateDev
);
app.patch(
  "/developers/:id/infos",
  checkIfDevIdExists,
  checkPatchDevInfoBodyRequest,
  updateDevInfo
);
app.delete("/developers/:id", checkIfDevIdExists, deleteDev);

app.listen(3000, async () => {
  await startDatabase();
  console.log("Server is running!");
});
