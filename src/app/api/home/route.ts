import { NextRequest } from "next/server";
import { requireSessionUser } from "@/server/auth/session";
import { homePayload } from "@/server/mocks/homePayload";
import { handleApiRequest, successResponse } from "@/shared/api/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return handleApiRequest(request, async ({ request: apiRequest, requestId }) => {
    requireSessionUser(apiRequest);
    await new Promise((resolve) => setTimeout(resolve, 250));
    return successResponse(requestId, homePayload);
  });
}
