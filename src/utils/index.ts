import Elysia from "elysia";
import type { z } from "zod";
import type { Permission } from "./auth";

export * from "./logger";
export * from "./middleware";
export * from "./auth";

export const createId = (length: number = 35) => {
  let chars =
    "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890-_";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
};

export const parseRequestBody = async <T>(
  request: Request,
  schema?: z.ZodSchema<T>
) => {
  const b = await request
    .json()
    .catch(() => null)
    .then((d) => d);
  if (schema) {
    try {
      schema.parse(b);
    } catch (e) {
      return {
        data: null,
        res: new Response(
          JSON.stringify({
            ok: false,
            message: "Failed to parse body into schema.",
            error: e,
          }),
          {
            status: 422,
          }
        ),
      };
    }
  }
  return {
    data: b as T,
    res: null,
  };
};

export const defaultRoutes = new Elysia().get(`/`, () => ({
  ok: false,
  message: `Invalid prefix provided.`,
  valid_prefixes: {
    "/v1/*": [`/v1/auth/*`],
  },
}));

export const defaultResponses = {
  no_body: new Response(
    JSON.stringify({
      ok: false,
      message: `Failed to parse json.`,
    }),
    {
      status: 500,
    }
  ),
  invalid_auth: new Response(
    JSON.stringify({
      ok: false,
      message: `Invalid authorization token.`,
    }),
    {
      status: 404,
    }
  ),
  invalid_perms: (permissions: Permission[]) =>
    new Response(
      JSON.stringify({
        ok: false,
        message: "Missing required permissions.",
        notice: `"admin:*" does not have permission limitations.`,
        expected: permissions,
      }),
      {
        status: 404,
      }
    ),
};
