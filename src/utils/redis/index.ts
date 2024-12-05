import { createClient } from "redis";
import { error_log } from "../logger";

export const redisClient = createClient({
  url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on("error", (e) => {
  error_log(`Issue with the Redis Client.\n${e}`);
  process.exit(1);
});
