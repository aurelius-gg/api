import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "../../utils";

export const userTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: text("email"),
  system: boolean("system_user").default(false),
  password: text("encrypted_password"),
  permissions: text("permissions").array(),
  auth_token: text("authorization_token")
    .notNull()
    .$defaultFn(() => createId()),
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
});

export type UserSelect = typeof userTable.$inferSelect;
export type UserInsert = typeof userTable.$inferInsert;
