import staticPlugin from "@elysiajs/static";
import { Elysia } from "elysia";
import { core } from "./core";
import { defaultRoutes, http_logger, info_log } from "./utils";
import { redisClient } from "./utils/redis";
import { $ } from "bun";

export const app = new Elysia()
  .use(http_logger)
  .use(defaultRoutes)
  .use(core)
  .use(
    staticPlugin({
      prefix: "~",
    })
  )
  .listen(
    {
      port: 3724,
      hostname: "0.0.0.0",
    },
    async () => {
      $`bun run db:update`
      await redisClient.connect().then(() => {
        info_log("Connected to redis client.");
      });
      info_log("Listening on 0.0.0.0:3724");
    }
  );
