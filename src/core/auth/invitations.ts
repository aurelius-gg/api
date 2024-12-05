import Elysia from "elysia";
import { parseRequestBody } from "../../utils";
import { z } from "zod";
import { validateViaCode } from "../../utils/auth/invitations";
import { db } from "../../db";
import { invitationTable } from "../../db/schema/invitations";

export const invitations = new Elysia({ prefix: "/invitations" })
  .post("/use", async ({ request }) => {
    const { data: body, res } = await parseRequestBody(
      request,
      z.object({
        code: z.string(),
      })
    );
    if (res) return res;
    const [validResultsBody, validResultsStatus] = await validateViaCode(
      body.code
    );

    if (!validResultsBody.ok)
      return new Response(JSON.stringify(validResultsBody), {
        status: validResultsStatus,
      });

    if (validResultsBody.data?.used)
      return new Response(
        JSON.stringify({
          ok: false,
          message: "Invitation has already been used.",
          data: null,
        }),
        { status: 403 }
      );

    const updatedData = await db
      .update(invitationTable)
      .set({
        used: true,
      })
      .returning();

    return new Response(
      JSON.stringify({
        ok: true,
        message: "Invitation has now been used.",
        data: updatedData,
      }),
      { status: 200 }
    );
  })
  // Validate invitation
  .post("/validate", async ({ request }) => {
    const { data: body, res } = await parseRequestBody(
      request,
      z.object({
        code: z.string(),
      })
    );

    if (res) return res;

    const [validResultsBody, validResultsStatus] = await validateViaCode(
      body.code
    );
    return new Response(JSON.stringify(validResultsBody), {
      status: validResultsStatus,
    });
  });
