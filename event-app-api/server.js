import express from "express";
import cors from "cors";
import { sequelize } from "./database.js";
import { User, Event } from "./models/index.js";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { createTokens, validateToken } from "./JWT.js";
import {
  mergeIntervals,
  findGaps,
  isOverlapping,
  getAllUsersPreferredTimes,
  respectsPreferredTimes,
} from "./merge_intervals/merge_intervals.js";
import { Op } from "sequelize";

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

//setting a POST request to the editProfile endpoint
app.post("/editProfile", (req, res) => {
  const username = req.body.username;
  const fullname = req.body.fullname;
  const email = req.body.email;
  const tel = req.body.tel;
  const preferredEndTime = req.body.preferredendtime;
  const preferredStartTime = req.body.preferredstarttime;

  if (fullname) {
    sequelize.query(
      `UPDATE "public"."Users" SET fullname = '${fullname}' WHERE username = '${username}'`,
      { type: sequelize.QueryTypes.UPDATE },
      (err, result) => {
        res.json(err);
      }
    );
  }
  if (preferredStartTime) {
    sequelize.query(
      `UPDATE "public"."Users" SET preferredstarttime = '${preferredStartTime}' WHERE username = '${username}'`,
      { type: sequelize.QueryTypes.UPDATE },
      (err, result) => {
        res.json(err);
      }
    );
  }
  if (preferredEndTime) {
    sequelize.query(
      `UPDATE "public"."Users" SET preferredendtime = '${preferredEndTime}' WHERE username = '${username}'`,
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

//sending a get request to retrieve an event with a specific id
app.get("/find_event/:id", async (req, res) => {
  const id = Number(req.params.id);
  const event = await Event.findOne({
    order: [["starttime", "ASC"]],
    where: { id: id },
  });
  res.json(event);
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
    const currentDate = new Date().getTime() / 1000;
    const onGoingEvents = events.filter((event) => {
      const eventStartTime = event.starttime;
      const eventEndTime = event.endtime;
      return eventStartTime <= currentDate && eventEndTime > currentDate;
    });
    const futureEvents = events.filter((event) => {
      const eventStartTime = event.starttime;
      return eventStartTime > currentDate;
    });
    const pastEvents = events.filter((event) => {
      const eventEndTime = event.endtime;
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

//sending a get request to the find_gap endpoint
app.get("/find_availabilty", async (req, res) => {
  const selectedUsers = req.query.selectedUsers.map((user) => {
    return {
      username: user,
    };
  });

  const userPreferredTimes = await User.findAll({
    where: { [Op.or]: selectedUsers },
    attributes: ["preferredstarttime", "preferredendtime"],
  });

  const allUsersPreferredTime = getAllUsersPreferredTimes(userPreferredTimes);

  const events = await Event.findAll({
    order: [["starttime", "ASC"]],
    where: { [Op.or]: selectedUsers },
  });

  const gaps = findGaps(mergeIntervals(events));
  res.json({ userPreferredTimes: allUsersPreferredTime, gaps });
});

//sending a POST request to the endpoint event_popup
app.post("/event_popup", async (req, res) => {
  const eventName = req.body.eventName;
  const description = req.body.description;
  const location = req.body.location;
  const username = req.body.username;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const selectedUsers = req.body.selectedUsers.map((user) => {
    return { username: user.label };
  });

  // Add creator username to selectedUsers
  selectedUsers.push({ username: username });

  const startTimeEpoch = new Date(startTime).getTime() / 1000;
  const endTimeEpoch = new Date(endTime).getTime() / 1000;

  if (startTimeEpoch > endTimeEpoch) {
    //sending an error message to the client side
    res.json({
      errorMessage:
        "Current selected start time is later than end time. Please fix and try again.",
    });
  } else {
    // Sort events in ascending order for all selected users
    const events = await Event.findAll({
      order: [["starttime", "ASC"]],
      where: { [Op.or]: selectedUsers },
    });
    // Get all selected users preferred start and end times from db
    const userPreferredTimes = await User.findAll({
      where: { [Op.or]: selectedUsers },
      attributes: ["preferredstarttime", "preferredendtime"],
    });

    // Get one start time and end time based on preferences that will work for all selected users
    const jointPreferredTime = getAllUsersPreferredTimes(userPreferredTimes);
    // Check if currently inputed time respects users preferred times or only one user is tied to event (the creator)
    // We don't need to respect our own preferences.
    const isValidTime =
      respectsPreferredTimes(
        startTimeEpoch,
        endTimeEpoch,
        jointPreferredTime
      ) || selectedUsers.length == 1;

    const isEventOverlapping = isOverlapping(
      { starttime: startTimeEpoch, endtime: endTimeEpoch },
      events
    );

    if (isValidTime && !isEventOverlapping) {
      for (let i = 0; i < selectedUsers.length; i++) {
        //used the sequelize.query to inserting data into the events table
        sequelize.query(
          //The CURRENT_TIMESTAMP is the createdAt and the updatedAt in the database
          `INSERT INTO "public"."Events" (eventName, description, location , username, startTime, endTime, "createdAt", "updatedAt") VALUES ('${eventName}', '${description}', '${location}', '${selectedUsers[i].username}', '${startTimeEpoch}','${endTimeEpoch}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          { type: sequelize.QueryTypes.INSERT },
          (err, result) => {
            res.json(err);
          }
        );
      }
    } else if (!isValidTime) {
      res.json({
        errorMessage:
          "Current selected start and end time do not respect currently selected users preferences. Click find availabilty button to see preferences and non-overlapping times to select from and try again.",
      });
    } else {
      res.json({
        errorMessage:
          "Current selected start and end time are overlapping with other events. Click find availabilty button to see preferences and non-overlapping times to select from and try again.",
      });
    }
  }
});

sequelize.sync({ alter: true }).then(() => {
  const port = 3000;
  app.listen(port, () => {});
});
