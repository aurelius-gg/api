import { sql } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { defaultResponses } from "..";
import { db } from "../../db";
import { userTable } from "../../db/schema/users";

export const argon = new Argon2id();

export const parseAuthHeaders = async (request: Request) => {
	const token = request.headers.get("Authorization");

	if (!token) return defaultResponses.invalid_auth;

	const attachedToken = await db
		.select()
		.from(userTable)
		.where(sql`${userTable.auth_token} = ${token}`);

	if (attachedToken && attachedToken.length > 0) {
		return attachedToken[0];
	}
	return defaultResponses.invalid_auth;
};

export * from "./permissions";
