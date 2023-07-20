import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User, Event } from "./models/index.js";
import { sequelize } from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./seeders/users.json"), "utf8")
);
const eventData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./seeders/events.json"), "utf8")
);

const seedDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    await Event.bulkCreate(eventData);
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await sequelize.close();
  }
};
seedDatabase();
