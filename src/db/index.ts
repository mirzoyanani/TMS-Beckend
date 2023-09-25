import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const config: mysql.PoolOptions = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "3306", 10),
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
};

const db: Pool = mysql.createPool(config);

export default db;
