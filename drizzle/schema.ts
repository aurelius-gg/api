import { pgTable, integer, text, boolean, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const invitations = pgTable("invitations", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "invitations_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	invitationCode: text("invitation_code"),
	used: boolean().default(false),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
});

export const rateLimits = pgTable("rate_limits", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "rate_limits_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	ip: text().notNull(),
	requestCount: integer("request_count").default(1),
});

export const users = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	email: text(),
	systemUser: boolean("system_user").default(false),
	encryptedPassword: text("encrypted_password"),
	permissions: text().array(),
	authorizationToken: text("authorization_token").notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});
