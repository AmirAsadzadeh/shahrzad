import type { Banner, HomePayload, ServiceTile } from "@/entities/home/model/types";
import { http } from "@/shared/api/http";
import { isRecord, parseApiData } from "@/shared/api/parseApiData";

export async function getHomeData(): Promise<HomePayload> {
  const data = await http.get<never, unknown>("/home");
  return parseApiData(data, isHomePayload);
}

function isHomePayload(value: unknown): value is HomePayload {
  return (
    isRecord(value) &&
    Array.isArray(value.tiles) &&
    value.tiles.every(isServiceTile) &&
    Array.isArray(value.banners) &&
    value.banners.every(isBanner)
  );
}

function isServiceTile(value: unknown): value is ServiceTile {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.image === "string" &&
    typeof value.url === "string" &&
    typeof value.order === "number" &&
    (value.child === undefined ||
      (Array.isArray(value.child) && value.child.every(isServiceTile)))
  );
}

function isBanner(value: unknown): value is Banner {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    typeof value.image === "string" &&
    typeof value.url === "string" &&
    typeof value.order === "number"
  );
}
