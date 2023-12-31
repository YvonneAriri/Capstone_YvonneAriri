import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const User = sequelize.define("User", {
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  preferredstarttime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  preferredendtime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
