import { arrayContains, inArray, sql } from "drizzle-orm";
import { db } from "../src/db";
import { userTable } from "../src/db/schema/users";
import { argon, createId, info_log } from "../src/utils";
import { invitationTable } from "../src/db/schema/invitations";
import { sys } from "typescript";

(async () => {
  const promises = [];
  const adminUsers = await db
    .select()
    .from(userTable)
    .where(arrayContains(userTable.permissions, ["admin:all"]));
  if (!adminUsers || adminUsers.length <= 0) {
    promises.push(async () => {
      const password = await argon.hash("changeme");
      const data = await db.insert(userTable).values({
        permissions: ["admin:all"],
        email: "admin@localhost.com",
        password: password,
      });
      info_log(
        'Default admin user created. (Email: admin@localhost.com, Password: "changeme"'
      );
      console.log(data);
    });
  }

  const systemUser = await db
    .select()
    .from(userTable)
    .where(arrayContains(userTable.permissions, ["system:*"]));
  if (!systemUser || systemUser.length <= 0) {
    promises.push(async () => {
      const data = await db
        .insert(userTable)
        .values({
          permissions: ["system:*"],
        })
        .returning();

      info_log("Created default system user (used by the admin dashboard)");
      console.log(data);
    });
  }

  Promise.all(promises).then(() => {
    info_log("Database seeded");
    process.exit(0)
  });
  // const generatedEmail = `${createId(10)}@example.com`;
  // const userEmail = `${createId(7)}@example.com`;
  // const systemUser = await db
  //   .select()
  //   .from(userTable)
  //   .where(arrayContains(userTable.permissions, ["system:*"]));
  // if (!systemUser || systemUser.length <= 0) {
  //   await db
  //     .insert(userTable)
  //     .values({
  //       system: true,
  //       permissions: ["system:*"],
  //     })
  //     .returning()
  //     .then((r) => {
  //       console.log(r);
  //       process.exit(0);
  //     });
  // } else {
  //   console.log(systemUser);
  //   process.exit(0);
  // }
  // await db.insert(invitationTable).values({});
  // db.insert(userTable)
  //   .values({
  //     email: generatedEmail,
  //     password: createId(15),
  //     permissions: ["admin:all"],
  //   })
  //   .then(async () => {
  //     info_log("Admin seeded");
  //   })
  //   .then(() => {
  //     db.insert(userTable)
  //       .values({
  //         email: userEmail,
  //         password: `${createId(25)}`,
  //         permissions: ["user:create", "user:fetch"],
  //       })
  //       .then(() => {
  //         info_log("User example seeded");
  //       })
  //       .then(async () => {
  //         const data = await db
  //           .select()
  //           .from(userTable)
  //           .where(
  //             sql`${userTable.email} = ${userEmail} OR ${userTable.email} = ${generatedEmail}`
  //           );
  //         console.log(data);
  //         process.exit(0);
  //       });
  //   });
})();
