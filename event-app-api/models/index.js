import { User } from "./user.js";
import { Event } from "./event.js";

User.hasMany(Event, { foreignKey: "userId" });
Event.belongsTo(User, { foreignKey: "userId" });

export { User, Event };
