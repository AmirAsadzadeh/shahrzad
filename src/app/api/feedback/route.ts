import { NextRequest } from "next/server";
import { requireSessionUser } from "@/server/auth/session";
import { getClientKey, handleApiRequest, readJsonBody, successResponse } from "@/shared/api/server";
import { enforceRateLimit } from "@/shared/lib/rateLimit";
import { parseFeedbackInput } from "@/shared/lib/validation";

export const runtime = "nodejs";

type FeedbackBody = {
  rating?: unknown;
  description?: unknown;
};

export async function GET(request: NextRequest) {
  return handleApiRequest(request, async ({ request: apiRequest, requestId }) => {
    requireSessionUser(apiRequest);
    return successResponse(requestId, { showModal: false });
  });
}

export async function POST(request: NextRequest) {
  return handleApiRequest(request, async ({ request: apiRequest, requestId }) => {
    const user = requireSessionUser(apiRequest);
    enforceRateLimit(`feedback:${user.id}:${getClientKey(apiRequest)}`, 5, 60 * 60_000);
    const body = await readJsonBody<FeedbackBody>(apiRequest);
    const feedback = parseFeedbackInput(body);

    console.info("Feedback accepted", {
      requestId,
      userId: user.id,
      rating: feedback.rating,
      descriptionLength: feedback.description.length
    });

    return successResponse(requestId, { submitted: true }, 201);
  });
}
