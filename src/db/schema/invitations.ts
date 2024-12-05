import dayjs from "dayjs";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "../../utils";

export const invitationTable = pgTable("invitations", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  invitationCode: text("invitation_code").$defaultFn(() => createId(7)),
  used: boolean("used").default(false),
  expires_at: timestamp("expires_at").$defaultFn(() =>
    dayjs(new Date()).add(1, "hour").toDate()
  ),
});
export type InvitationSelect = typeof invitationTable.$inferSelect;
export type InvitationInsert = typeof invitationTable.$inferInsert;
