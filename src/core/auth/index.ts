import Elysia from "elysia";
import { z } from "zod";
import {
  type Permission,
  defaultResponses,
  info_log,
  parseAuthHeaders,
  parseRequestBody,
  userHasPermissions,
} from "../../utils";
import { db } from "../../db";
import { userTable } from "../../db/schema/users";
import { invitations } from "./invitations";

export const auth = new Elysia({ prefix: "/auth" })
  .use(invitations)
  // Fetch current user
  .get("/user", async ({ request }) => {
    const notValid = await parseAuthHeaders(request);
    if (notValid instanceof Response) return notValid;
    return {
      ...notValid,
      password: "REDACTED",
    };
  })
  .get("/user.list", async ({ request }) => {
    const user = await parseAuthHeaders(request);
    if (user instanceof Response) return user;
    if (!userHasPermissions(user, "admin:all"))
      return defaultResponses.invalid_perms(["admin:all"]);

    const allUsers = await db.select().from(userTable);
    return new Response(JSON.stringify(allUsers), {
      status: 200,
    });
  })
  // Create new user
  .post("/user", async ({ request }) => {
    const user = await parseAuthHeaders(request);
    if (user instanceof Response) return user;
    if (!userHasPermissions(user, "user:create"))
      return defaultResponses.invalid_perms(["user:create"]);

    const { data: body, res } = await parseRequestBody(
      request,
      z.object({
        email: z.string(),
        encrypted_password: z.string(),
        permissions: z.array(z.string()),
      })
    );

    if (!body) return res;

    let canAssignAllPermissions = true;
    const conflictingPerms: Permission[] = [];
    if (user.permissions) {
      for (const permission of body.permissions) {
        if (!userHasPermissions(user, permission as Permission)) {
          canAssignAllPermissions = false;
          conflictingPerms.push(permission as Permission);
        }
      }
    }

    if (!canAssignAllPermissions)
      return defaultResponses.invalid_perms(conflictingPerms);

    await db
      .insert(userTable)
      .values({
        email: body.email,
        password: body.encrypted_password,
        permissions: body.permissions,
      })
      .returning()
      .then((d) => {
        info_log(
          `New user created. -> ${body.email} (${body.permissions.join(", ")})`
        );
        return d[0];
      });
    return new Response(
      JSON.stringify({
        ok: true,
        message: "User created successfully.",
      }),
      {
        status: 200,
      }
    );
  });

// .get(`/user`, async ({ request }) => {
//   const schema = z.object({
//     user_id: z.string(),
//   });
//   const body = await parseRequestBody(request, schema);
//   if (!body.data) return body.res;

//   console.log(body);
// })
//
//     user_id: z.string(),
//   });
//   const body = await parseRequestBody(request, schema);
//   if (!body.data) return body.res;

//   console.log(body);
// });
