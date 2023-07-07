import { User } from "./user.js";
import { Event } from "./event.js";

User.hasMany(Event, { foreignKey: "username" });
Event.belongsTo(User, { foreignKey: "username" });

export { User, Event };
