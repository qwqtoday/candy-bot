import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import { SQLiteTable } from "drizzle-orm/sqlite-core";
import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const users = sqliteTable("users", {
  uuid: text("uuid").primaryKey().notNull().unique(),
  level: integer("level").default(0).notNull(),
});

export default users;
