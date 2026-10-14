import { NextRequest } from "next/server";
import { createOtpNonce } from "@/server/auth/session";
import { getClientKey, handleApiRequest, readJsonBody, successResponse } from "@/shared/api/server";
import { enforceRateLimit } from "@/shared/lib/rateLimit";
import { parsePhoneNumber } from "@/shared/lib/validation";

export const runtime = "nodejs";

type OtpRequestBody = {
  phoneNumber?: unknown;
};

export async function POST(request: NextRequest) {
  return handleApiRequest(request, async ({ request: apiRequest, requestId }) => {
    const clientKey = getClientKey(apiRequest);
    enforceRateLimit(`otp:ip:${clientKey}`, 10, 60_000);

    const body = await readJsonBody<OtpRequestBody>(apiRequest);
    const phoneNumber = parsePhoneNumber(body.phoneNumber);
    enforceRateLimit(`otp:phone:${phoneNumber}`, 3, 10 * 60_000);

    return successResponse(requestId, {
      status: "login" as const,
      traceNo: crypto.randomUUID(),
      expireIn: 120,
      nonce: createOtpNonce(phoneNumber)
    });
  });
}
