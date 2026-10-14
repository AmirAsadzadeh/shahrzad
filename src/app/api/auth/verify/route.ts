import { NextRequest } from "next/server";
import { AppError } from "@/shared/api/errors";
import { consumeOtpNonce, createSessionResponseCookie } from "@/server/auth/session";
import { getClientKey, handleApiRequest, readJsonBody, successResponse } from "@/shared/api/server";
import { enforceRateLimit } from "@/shared/lib/rateLimit";
import { parseNonce, parseOtpInput, parsePhoneNumber } from "@/shared/lib/validation";

export const runtime = "nodejs";

type VerifyBody = {
  phoneNumber?: unknown;
  code?: unknown;
  nonce?: unknown;
};

export async function POST(request: NextRequest) {
  return handleApiRequest(request, async ({ request: apiRequest, requestId }) => {
    const body = await readJsonBody<VerifyBody>(apiRequest);
    const phoneNumber = parsePhoneNumber(body.phoneNumber);
    const code = parseOtpInput(body.code);
    const nonce = parseNonce(body.nonce);

    enforceRateLimit(`verify:ip:${getClientKey(apiRequest)}`, 10, 10 * 60_000);
    enforceRateLimit(`verify:phone:${phoneNumber}`, 5, 10 * 60_000);
    if (code !== "123456") {
      throw new AppError("کد وارد شده صحیح نیست.", { status: 400, code: "BAD_REQUEST" });
    }

    consumeOtpNonce(nonce, phoneNumber);

    const response = successResponse(requestId, {
      user: { id: phoneNumber, displayName: "کاربر شهرزاد", mobile: phoneNumber }
    });
    createSessionResponseCookie(response, phoneNumber);
    return response;
  });
}
