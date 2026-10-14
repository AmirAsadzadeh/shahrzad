import { NextRequest } from "next/server";
import { getSessionUser } from "@/server/auth/session";
import { handleApiRequest, successResponse } from "@/shared/api/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return handleApiRequest(request, async ({ request: apiRequest, requestId }) => {
    const user = getSessionUser(apiRequest);
    return successResponse(requestId, { authenticated: Boolean(user), user });
  });
}
