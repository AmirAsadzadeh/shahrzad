export type AuthMethod = "none" | "handshake" | "refresh";

export type WalletType = "pelican" | "shahrzad" | "all";

export type ServiceTile = {
  id: number;
  title: string;
  image: string;
  url: string;
  order: number;
  child?: ServiceTile[];
};

export type Banner = {
  id: number;
  name: string;
  image: string;
  url: string;
  order: number;
};

export type HomePayload = {
  tiles: ServiceTile[];
  banners: Banner[];
};
