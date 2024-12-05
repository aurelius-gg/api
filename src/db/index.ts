import { databaseUrl } from "@/utils";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(`postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/europa_postgres`);
