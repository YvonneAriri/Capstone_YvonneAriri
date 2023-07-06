import express from "express";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./database.js";
import { User, Event } from "./models/index.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

sequelize
  .sync({ alter: true })
  .then(() => {
    const port = 3000;
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
