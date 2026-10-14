import type { Banner, HomePayload, ServiceTile } from "@/entities/home/model/types";

export const serviceTiles: ServiceTile[] = [
  {
    id: 1,
    title: "میوه و تره‌بار",
    icon: "Apple",
    image: "https://static.shahrzadcity.ir/base/app_icon/zf7YT1txdp.webp",
    url: "/fruit-market",
    order: 1,
    authMethod: "refresh",
    walletType: ["all"]
  },
  {
    id: 2,
    title: "تورم صفر",
    icon: "Gift",
    image: "https://static.shahrzadcity.ir/base/app_icon/oL2K9V1DfT.webp",
    url: "/zero-inflation",
    order: 2,
    authMethod: "none",
    walletType: ["all"]
  },
  {
    id: 3,
    title: "فروشگاه شهروند",
    icon: "Shop",
    image: "https://static.shahrzadcity.ir/base/app_icon/ZXX4xcbjgQ.webp",
    url: "/marketplace",
    order: 3,
    authMethod: "refresh",
    walletType: ["all"]
  },
  {
    id: 4,
    title: "طرح ترافیک",
    icon: "SmartCar",
    image: "https://static.shahrzadcity.ir/base/app_icon/M3mev5TBtF.webp",
    url: "/traffic-plan",
    order: 4,
    authMethod: "refresh",
    walletType: ["all"]
  },
  {
    id: 5,
    title: "اسکوتر کن",
    icon: "RouteSquare",
    image: "https://static.shahrzadcity.ir/base/app_icon/n2S9ciWpSz.webp",
    url: "/scooter",
    order: 5,
    authMethod: "none",
    walletType: ["all"]
  },
  {
    id: 6,
    title: "نوماند",
    icon: "ArchiveBox",
    image: "https://static.shahrzadcity.ir/base/app_icon/HWHQNR2cua.webp",
    url: "/nomand",
    order: 6,
    authMethod: "refresh",
    walletType: ["all"]
  },
  {
    id: 7,
    title: "عوارض ملک",
    icon: "House",
    image: "https://static.shahrzadcity.ir/base/app_icon/rWEE7sGwvC.webp",
    url: "/property-tax",
    order: 7,
    authMethod: "refresh",
    walletType: ["all"]
  },
  {
    id: 8,
    title: "عوارض خودرو",
    icon: "Car",
    image: "https://static.shahrzadcity.ir/base/app_icon/e00arQrjW2.webp",
    url: "/vehicle-profile",
    order: 8,
    authMethod: "refresh",
    walletType: ["all"]
  },
  {
    id: 9,
    title: "معاینه فنی",
    icon: "Driver",
    image: "https://static.shahrzadcity.ir/base/app_icon/WoA2d9RktC.webp",
    url: "/technical-inspection",
    order: 9,
    authMethod: "refresh",
    walletType: ["all"]
  },
  {
    id: 10,
    title: "چشم روشنی",
    icon: "Star1",
    image: "https://static.shahrzadcity.ir/base/app_icon/rmMD2kfJb6.webp",
    url: "/cheshm-roshani",
    order: 10,
    authMethod: "none",
    walletType: ["all"]
  },
  {
    id: 11,
    title: "+۱۳۷",
    icon: "TicketDiscount",
    image: "https://static.shahrzadcity.ir/base/app_icon/HycKJYV1f8.webp",
    url: "/137",
    order: 11,
    authMethod: "none",
    walletType: ["all"],
    child: [
      {
        id: 1101,
        title: "ثبت درخواست",
        icon: "MessageQuestion",
        url: "/137/request",
        order: 1,
        authMethod: "none",
        walletType: ["all"]
      }
    ]
  },
  {
    id: 12,
    title: "مترو و اتوبوس",
    icon: "Bus",
    image: "https://static.shahrzadcity.ir/base/app_icon/jmIESUuZDq.webp",
    url: "/abt-ticket",
    order: 12,
    authMethod: "refresh",
    walletType: ["pelican"],
    child: [
      {
        id: 1201,
        title: "خرید بلیت",
        icon: "Ticket2",
        url: "/abt-ticket/cards-list",
        order: 1,
        authMethod: "refresh",
        walletType: ["pelican"]
      },
      {
        id: 1202,
        title: "کارت های من",
        icon: "Card",
        url: "/abt-ticket/my-cards",
        order: 2,
        authMethod: "refresh",
        walletType: ["pelican"]
      }
    ]
  },
  {
    id: 13,
    title: "کرایه تاکسی",
    icon: "CardTick",
    image: "https://static.shahrzadcity.ir/base/app_icon/wTU0HvTAz9.webp",
    url: "/taxi-passenger",
    order: 13,
    authMethod: "handshake",
    walletType: ["all"]
  },
  {
    id: 14,
    title: "خانه‌ریز",
    icon: "Buildings",
    image: "https://static.shahrzadcity.ir/base/app_icon/1mlpqTCGwm.webp",
    url: "/khane-riz",
    order: 14,
    authMethod: "none",
    walletType: ["all"]
  },
  {
    id: 15,
    title: "دوچرخه",
    icon: "RouteSquare",
    image: "https://static.shahrzadcity.ir/base/app_icon/coaazMP8p2.webp",
    url: "/bike",
    order: 15,
    authMethod: "none",
    walletType: ["all"]
  },
  {
    id: 16,
    title: "پارک حاشیه‌ای",
    icon: "Ticket",
    image: "https://static.shahrzadcity.ir/base/app_icon/F9vGqk2JpJ.webp",
    url: "/parking",
    order: 16,
    authMethod: "refresh",
    walletType: ["all"]
  },
  {
    id: 17,
    title: "تلویزیون",
    icon: "VideoTick",
    image: "https://static.shahrzadcity.ir/base/app_icon/4cKDN66kX4.webp",
    url: "/tv",
    order: 17,
    authMethod: "none",
    walletType: ["all"]
  },
  {
    id: 18,
    title: "کودک",
    icon: "Game",
    image: "https://static.shahrzadcity.ir/base/app_icon/YByrf4I6tA.webp",
    url: "/child",
    order: 18,
    authMethod: "none",
    walletType: ["all"]
  },
  {
    id: 19,
    title: "جستوجوی متوفی",
    icon: "SearchNormal",
    image: "https://static.shahrzadcity.ir/base/app_icon/xyDIjdo3KR.webp",
    url: "/deceased-search",
    order: 19,
    authMethod: "none",
    walletType: ["all"]
  },
  {
    id: 20,
    title: "ورزش",
    icon: "Weight",
    image: "https://static.shahrzadcity.ir/base/app_icon/fdCEr3EhEd.webp",
    url: "/sport",
    order: 20,
    authMethod: "none",
    walletType: ["all"]
  },
  {
    id: 21,
    title: "تهران مجازی",
    icon: "GlobalSearch",
    image: "https://static.shahrzadcity.ir/base/app_icon/hORbs6me79.webp",
    url: "/virtual-tehran",
    order: 21,
    authMethod: "none",
    walletType: ["all"],
    child: [
      {
        id: 2101,
        title: "تور ۳۶۰",
        icon: "GlobalSearch",
        url: "/virtual-tehran/360",
        order: 1,
        authMethod: "none",
        walletType: ["all"]
      }
    ]
  },
  {
    id: 22,
    title: "باشگاه همکارا",
    icon: "I3DCubeScan",
    image: "https://static.shahrzadcity.ir/base/app_icon/A1ZyAYtRHG.webp",
    url: "/club",
    order: 22,
    authMethod: "refresh",
    walletType: ["all"]
  },
  {
    id: 23,
    title: "هم‌پیمایی",
    icon: "SmartCar",
    image: "https://static.shahrzadcity.ir/base/app_icon/5ZEbonQSjp.webp",
    url: "/carpooling",
    order: 23,
    authMethod: "none",
    walletType: ["all"]
  }
];

export const banners: Banner[] = [
  {
    id: 1,
    name: "چشم‌روشنی",
    image: "https://static.shahrzadcity.ir/base/banner/W1o5hJAgO1.jpg",
    url: "/cheshm-roshani",
    order: 1,
    position: "top"
  },
  {
    id: 2,
    name: "طرح ترافیک روزانه و ماهانه",
    image: "https://static.shahrzadcity.ir/base/banner/B1LyrIbcRf.jpg",
    url: "/traffic-plan",
    order: 2,
    position: "top"
  },
  {
    id: 3,
    name: "اپلیکیشن شهرزاد",
    image:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1100' height='444' viewBox='0 0 1100 444'><rect width='1100' height='444' rx='28' fill='%23f5f9ff'/><path d='M0 320c205-94 394-70 566 0s347 83 534-26v150H0z' fill='%23307fe2' fill-opacity='.16'/><text x='790' y='182' fill='%23171b22' font-size='38' font-family='Tahoma' font-weight='700' text-anchor='middle'>همه خدمات در یک شهر</text><text x='790' y='238' fill='%236f7681' font-size='23' font-family='Tahoma' text-anchor='middle'>نسخه موبایل شهرزاد را دریافت کنید</text><rect x='154' y='74' width='210' height='296' rx='36' fill='%23307fe2'/><rect x='178' y='116' width='162' height='212' rx='24' fill='white'/><circle cx='259' cy='348' r='11' fill='white'/></svg>",
    url: "https://shahrzadcity.ir/download-app",
    order: 3,
    position: "bottom"
  }
];

export const homePayload: HomePayload = {
  tiles: [...serviceTiles].sort((a, b) => a.order - b.order),
  floatingBarTiles: [
    {
      id: 9001,
      title: "خدمات",
      icon: "BoxSearch",
      url: "/services",
      order: 1,
      authMethod: "none",
      walletType: ["all"]
    },
    {
      id: 9002,
      title: "کیف پول",
      icon: "Wallet3",
      url: "/wallet",
      order: 2,
      authMethod: "refresh",
      walletType: ["all"]
    }
  ],
  banners: [...banners].sort((a, b) => a.order - b.order)
};
