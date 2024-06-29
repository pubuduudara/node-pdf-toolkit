import "reflect-metadata";
import { DataSource } from "typeorm";
import { PdfGeneratorStatus } from "./entities/PdfGeneratorStatus";
import { Page } from "./entities/Page";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [PdfGeneratorStatus, Page],
});
