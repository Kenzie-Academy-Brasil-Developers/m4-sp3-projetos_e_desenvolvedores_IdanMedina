import express, { Application } from "express";
import { startDatabase } from "./database";
import { createDev } from "./logic/developers.logic";
import { checkPostBodyRequest } from "./middlewares/developers.middleware";

const app: Application = express();
app.use(express.json());

app.post("/developers", checkPostBodyRequest, createDev);
app.post("/developers/:id/infos");
app.get("developers");
app.get("developers/:id");

app.listen(3000, async () => {
  await startDatabase();
  console.log("Server is running!");
});
