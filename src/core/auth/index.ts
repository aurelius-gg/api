import Elysia from "elysia";
import {
  defaultResponses,
  parseAuthHeaders,
  parseRequestBody,
  userHasPermissions,
  type Permission,
} from "../../utils";
import { z } from "zod";

export const auth = new Elysia({ prefix: "/auth" })
  // Fetch current user
  .get(`/user`, async ({ request }) => {
    const notValid = await parseAuthHeaders(request);
    if (notValid instanceof Response) return notValid;
    return {
      ...notValid,
    };
  })
  // Create new user
  .post(`/user`, async ({ request }) => {
    const user = await parseAuthHeaders(request);
    if (user instanceof Response) return user;
    if (!userHasPermissions(user, "user:create"))
      return defaultResponses["invalid_perms"](["user:create"]);

    const { data: body, res: res } = await parseRequestBody(
      request,
      z.object({
        email: z.string(),
        encrypted_password: z.string(),
        permissions: z.array(z.string()),
      })
    );

    if (!body) return res;

    let canAssignAllPermissions = true;
    let conflictingPerms: Permission[] = [];
    body.permissions.forEach((permission) => {
      if (!userHasPermissions(user, permission as Permission)) {
        canAssignAllPermissions = false;
        conflictingPerms.push(permission as Permission);
      }
    });

    if (canAssignAllPermissions)
      return defaultResponses["invalid_perms"](conflictingPerms);

    
   });

// .get(`/user`, async ({ request }) => {
//   const schema = z.object({
//     user_id: z.string(),
//   });
//   const body = await parseRequestBody(request, schema);
//   if (!body.data) return body.res;

//   console.log(body);
// })
// .post(`/user/validate`, async ({ request }) => {
//   const schema = z.object({
//     user_id: z.string(),
//   });
//   const body = await parseRequestBody(request, schema);
//   if (!body.data) return body.res;

//   console.log(body);
// });
