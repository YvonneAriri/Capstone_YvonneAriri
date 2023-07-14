import express from "express";
import cors from "cors";
import { sequelize } from "./database.js";
import { User, Event } from "./models/index.js";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { createTokens, validateToken } from "./JWT.js";

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

/*
  created a get request to the endpoint to retrieve the users profile details for the
  specified username and sends it in Json format
 */
app.get("/profile/:username", validateToken, async (req, res) => {
  const username = req.params.username;

  const profileInfo = await User.findOne({
    attributes: { exclude: ["password"] },
    where: { username: username },
  });

  res.json(profileInfo);
});

//setting a POST request to the signup endpoint
app.post("/signup", (req, res) => {
  const fullname = req.body.fullname;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const tel = req.body.tel;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      res.send(err);
    }
    //used the sequelize.query method to insert data into the Users table
    sequelize.query(
      `INSERT INTO "public"."Users" (fullname, username, password, email, tel, "createdAt", "updatedAt") VALUES ('${fullname}', '${username}', '${hash}', '${email}', '${tel}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      { type: sequelize.QueryTypes.INSERT },
      (err, result) => {
        res.send(err);
      }
    );
  });
});

//setting a POST request to the login endpoint
app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  //Used the sequelize.query method to retrieve data from the user's table
  const result = await sequelize.query(
    `SELECT * FROM "public"."Users" WHERE username = '${username}'`,
    { type: sequelize.QueryTypes.SELECT }
  );

  if (result.length > 0) {
    const match = await bcrypt.compare(password, result[0].password);
    if (match) {
      const accessToken = createTokens(result);
      //setting a cookie in the HTTP response that will be sent to the client browser
      res.cookie("access-token", accessToken, {
        //setting the maximum age of the cookie
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.json(result);
    } else {
      res.send({ message: "Wrong username and wrong password" });
    }
  } else {
    res.send({ message: "user doesn't exist" });
  }
});

//sending a get request to the users endpoint
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
    console.log("Unable to connect to the database:", error);
  });
