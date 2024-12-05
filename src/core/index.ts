import Elysia from "elysia";
import { auth } from "./auth";

export const core = new Elysia({
	prefix: "/v1",
})
	.use(auth)
	.get("/", () => ({
		cookies: "with",
		milk: true,
	}));
