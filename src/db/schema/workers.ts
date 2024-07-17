import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import users from "./users";

const workers = sqliteTable("workers", {
  id: integer("id").primaryKey(),
  name: text("name"),
  owner: text("owner").references(() => users.uuid),
  config: text("config")
});

export default workers;
