import express, { Application } from "express";
import { startDatabase } from "./database";
import {
  createDev,
  createDevInfo,
  createProject,
  deleteDev,
  deleteProject,
  readDev,
  readDevs,
  readProject,
  readProjects,
  updateDev,
  updateDevInfo,
} from "./logic";
import {
  checkIfDevIdExists,
  checkPatchDevBodyRequest,
  checkPostBodyRequest,
  checkPatchDevInfoBodyRequest,
  checkPostBodyDevInfoRequest,
  checkPostProjBodyRequest,
  checkIfDevIdToProj,
  checkIfDevIdToTechProj,
} from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/developers", checkPostBodyRequest, createDev);
app.post(
  "/developers/:id/infos",
  checkIfDevIdExists,
  checkPostBodyDevInfoRequest,
  createDevInfo
);
app.post(
  "/projects",
  checkPostProjBodyRequest,
  checkIfDevIdToProj,
  createProject
);
app.get("/developers", readDevs);
app.get("/projects", readProjects);
app.get("/projects/:id", checkIfDevIdToTechProj, readProject);
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
app.patch(
  "/projects/:id",
  checkPostProjBodyRequest,
  checkIfDevIdToTechProj,
  checkIfDevIdToProj
);
app.delete("/developers/:id", checkIfDevIdExists, deleteDev);
app.delete("/projects/:id", checkIfDevIdToTechProj, deleteProject);

app.listen(3000, async () => {
  await startDatabase();
  console.log("Server is running!");
});
