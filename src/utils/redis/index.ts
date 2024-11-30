import { createClient } from "redis";
import { error_log } from "../logger";

export const redisClient = createClient({
  url: process.env.REDIS_URL!,
});

redisClient.on("error", (e) => {
  error_log(`Issue with the Redis Client.\n${e}`);
  process.exit(1);
});
