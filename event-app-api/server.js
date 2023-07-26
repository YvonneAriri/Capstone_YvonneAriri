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

//setting a POST request to the editProfile  endpoint
app.post("/editProfile", (req, res) => {
  const username = req.body.username;
  const fullname = req.body.fullname;
  const email = req.body.email;
  const tel = req.body.tel;

  if (fullname) {
    sequelize.query(
      `UPDATE "public"."Users" SET fullname = '${fullname}' WHERE username = '${username}'`,
      { type: sequelize.QueryTypes.UPDATE },
      (err, result) => {
        res.json(err);
      }
    );
  }
  if (email) {
    sequelize.query(
      `UPDATE "public"."Users" SET email = '${email}' WHERE username = '${username}'`,
      { type: sequelize.QueryTypes.UPDATE },
      (err, result) => {
        res.json(err);
      }
    );
  }
  if (tel) {
    sequelize.query(
      `UPDATE "public"."Users" SET tel = '${tel}' WHERE username = '${username}'`,
      { type: sequelize.QueryTypes.UPDATE },
      (err, result) => {
        res.json(err);
      }
    );
  }
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
    } else {
      //used the sequelize.query method to insert data into the Users table
      sequelize.query(
        //The CURRENT_TIMESTAMP is the createdAt and the updatedAt in the database
        `INSERT INTO "public"."Users" (fullname, username, password, email, tel, "createdAt", "updatedAt") VALUES ('${fullname}', '${username}', '${hash}', '${email}', '${tel}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        { type: sequelize.QueryTypes.INSERT },
        (err, result) => {
          res.json(err);
        }
      );
    }
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
      res.json({ errorMessage: "Wrong username and wrong password" });
    }
  } else {
    res.json({ errorMessage: "user doesn't exist" });
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

//sending a get request to the events endpoint
app.get("/events/:username", async (req, res) => {
  try {
    // filtered the events by the user's username using useParam
    const username = req.params.username;
    const events = await Event.findAll({
      // making the order of the events in a descending order depending on the time created
      order: [["starttime", "ASC"]],
      where: { username: username },
    });
    //filtered the users event into Ongoing, future, and past to keep track of their events
    const currentDate = new Date();
    const onGoingEvents = events.filter((event) => {
      const eventStartTime = new Date(event.starttime);
      const eventEndTime = new Date(event.endtime);
      return eventStartTime <= currentDate && eventEndTime > currentDate;
    });
    const futureEvents = events.filter((event) => {
      const eventStartTime = new Date(event.starttime);
      return eventStartTime > currentDate;
    });
    const pastEvents = events.filter((event) => {
      const eventEndTime = new Date(event.endtime);
      return eventEndTime < currentDate;
    });

    res.json({
      onGoingEvents: onGoingEvents,
      futureEvents: futureEvents,
      pastEvents: pastEvents,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//logout button to delete the cookies once clicked
app.get("/logout", async (req, res) => {
  if (!req.cookies) {
    res.status(401).end();
  }

  const accessToken = req.cookies["access-token"];
  if (!accessToken) {
    res.status(401).end();
  }

  res.cookie("access-token", "", {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    expires: new Date(),
  });
  res.end();
});

//sending a POST request to the endpoint event_popup
app.post("/event_popup", async (req, res) => {
  const eventName = req.body.eventName;
  const description = req.body.description;
  const location = req.body.location;
  const username = req.body.username;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;

  const startTimeObj = new Date(startTime);
  const startTimeEpoch = startTimeObj.getTime() / 1000;

  const endTimeObj = new Date(endTime);
  const endTimeEpoch = endTimeObj.getTime() / 1000;

  //used the sequelize.query to inserting data into the events table
  sequelize.query(
    //The CURRENT_TIMESTAMP is the createdAt and the updatedAt in the database
    `INSERT INTO "public"."Events" (eventName, description, location , username, startTime, endTime, "createdAt", "updatedAt") VALUES ('${eventName}', '${description}', '${location}', '${username}', '${startTimeEpoch}','${endTimeEpoch}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    { type: sequelize.QueryTypes.INSERT },
    (err, result) => {
      res.json(err);
    }
  );
});

sequelize.sync({ alter: true }).then(() => {
  const port = 3000;
  app.listen(port, () => {});
});
