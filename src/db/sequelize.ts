import { Sequelize } from "sequelize";
import { SequelizeOptions } from "sequelize-typescript";
import env from "@/lib/env";
import * as mysql2 from "mysql2";

const options: SequelizeOptions = {
  host: env.DB_HOST,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  port: parseInt(env.DB_PORT, 10),
  dialect: "mysql",
};

options.dialectModule = mysql2;

export const sequelize = new Sequelize(options);
