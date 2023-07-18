import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Event = sequelize.define("Event", {
  eventname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  starttime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endtime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
