import type { HomePayload } from "@/entities/home/model/types";
import { http } from "@/shared/api/http";

export function getHomeData(): Promise<HomePayload> {
  return http.get<never, HomePayload>("/home");
}
