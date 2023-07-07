import express from "express";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./database.js";
import { User, Event } from "./models/index.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/signUp", (req, res) => {
  const fullname = req.body.fullname;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const tel = req.body.tel;

  console.log("!!!", req);

  sequelize.query(
    `INSERT INTO "public"."Users" (fullname, username, password, email, tel, "createdAt", "updatedAt") VALUES ('${fullname}', '${username}', '${password}', '${email}', '${tel}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    { type: sequelize.QueryTypes.INSERT },
    (err, result) => {
      console.log(err);
    }
  );
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
