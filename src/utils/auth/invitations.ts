import { sql } from "drizzle-orm";
import { db } from "../../db";
import {
  invitationTable,
  type InvitationSelect,
} from "../../db/schema/invitations";

export type ValidCodeResponse = [
  {
    ok: boolean;
    message: string | null;
    data: InvitationSelect | null;
  },
  number
];
export const validateViaCode = async (code: string): Promise<ValidCodeResponse> => {
  const invitation = await db
    .select()
    .from(invitationTable)
    .where(sql`${invitationTable.invitationCode} = ${code}`);
  if (!invitation || invitation.length <= 0 || invitation[0].used)
    return [
      {
        ok: false,
        message: "Invalid invitation code provided.",
        data: null,
      },
      403,
    ];

  const expired_invitation =
    (invitation[0].expires_at?.getTime() ?? 0) < new Date().getTime();

  if (expired_invitation)
    return [
      {
        ok: false,
        message: "Invitation is expired.",
        data: null,
      },
      200,
    ];

  return [
    {
      ok: true,
      message: "Invitation is still valid.",
      data: invitation[0],
    },
    200,
  ];
};
