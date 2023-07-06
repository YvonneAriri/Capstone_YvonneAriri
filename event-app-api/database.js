import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "eventprep",
  "yvonneariri",
  "YvonneOma16@",
  {
    host: "localhost",
    dialect: "postgres",
  }
);
