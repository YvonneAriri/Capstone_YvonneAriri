import express from "express";
import cors from "cors";
import { sequelize } from "./database.js";
import { User, Event } from "./models/index.js";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";

const saltRounds = 10;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    optionSuccessStatus: 200,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subset",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
/*
  created a get request to the endpoint to retrieve the users profile details for the
  specified username and sends it in Json format
 */
app.get("/profile/:username", async (req, res) => {
  const username = req.params.username;

  const profileInfo = await User.findOne({
    attributes: { exclude: ["password"] },
    where: { username: username },
  });

  res.json(profileInfo);
});

app.post("/signup", (req, res) => {
  const fullname = req.body.fullname;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const tel = req.body.tel;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    sequelize.query(
      `INSERT INTO "public"."Users" (fullname, username, password, email, tel, "createdAt", "updatedAt") VALUES ('${fullname}', '${username}', '${hash}', '${email}', '${tel}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      { type: sequelize.QueryTypes.INSERT },
      (err, result) => {
        console.log(err);
      }
    );
  });
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const result = await sequelize.query(
    `SELECT * FROM "public"."Users" WHERE username = '${username}'`,
    { type: sequelize.QueryTypes.SELECT }
  );

  if (result.length > 0) {
    const match = await bcrypt.compare(password, result[0].password);

    if (match) {
      req.session.user = result;
      console.log(req.session.user);
      res.json(result);
    } else {
      res.send({ message: "Wrong username and wrong password" });
    }
  } else {
    res.send({ message: "user doesn't exist" });
  }
  console.log(result);
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/events", async (req, res) => {
  const listOfEvents = await Event.findAll();
  res.json(listOfEvents);
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
