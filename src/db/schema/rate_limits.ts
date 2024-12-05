import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const rateLimitsTable = pgTable("rate_limits", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	ip: text("ip").notNull(),
	requests: integer("request_count").default(1),
});
