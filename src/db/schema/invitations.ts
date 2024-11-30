import dayjs from "dayjs";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const invitationTable = pgTable(`invitations`, {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  invitationCode: text(`invitation_code`),
  expires_at: timestamp(`expires_at`).$defaultFn(() =>
    dayjs(new Date()).add(1, "hour").toDate()
  ),
});
