import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import { SQLiteTable } from "drizzle-orm/sqlite-core";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import users from "./users";

const workers = sqliteTable("workers", {
  id: integer("id").primaryKey(),
  name: text("name"),
  owner: text("owner").references(() => users.uuid),
});

export default workers;
