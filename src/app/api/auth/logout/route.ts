import { NextRequest } from "next/server";
import { clearSessionCookie } from "@/server/auth/session";
import { handleApiRequest, successResponse } from "@/shared/api/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  return handleApiRequest(request, async ({ requestId }) => {
    const response = successResponse(requestId, { loggedOut: true as const });
    clearSessionCookie(response);
    return response;
  });
}
