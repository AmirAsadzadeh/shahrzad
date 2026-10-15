"use client";

import { Drawer } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ServiceTile as ServiceTileType } from "@/entities/home/model/types";
import { ServiceTileMoreIndicator } from "@/features/home/components/ServiceTileMoreIndicator";
import { safeHref } from "@/shared/lib/url";

type Props = {
  tile: ServiceTileType;
};

export function ServiceTile({ tile }: Props) {
  const [open, setOpen] = useState(false);
  const hasChildren = Boolean(tile.child?.length);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!hasChildren) return;
    event.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <Link
        href={safeHref(tile.url)}
        onClick={handleClick}
        aria-haspopup={hasChildren ? "dialog" : undefined}
        aria-expanded={hasChildren ? open : undefined}
        className="relative flex cursor-pointer flex-col items-center text-center text-shahrzad-ink outline-none focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-shahrzad-primary md:flex-row md:justify-center md:text-right"
      >
        <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-shahrzad-surface-soft p-2 supports-[corner-shape:squircle]:rounded-full supports-[corner-shape:squircle]:[corner-shape:squircle]">
          <Image
            src={tile.image}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-contain supports-[corner-shape:squircle]:[corner-shape:squircle]"
          />

          {hasChildren && (
            <ServiceTileMoreIndicator className="text-shahrzad-primary" />
          )}
        </span>
        <span className="mt-2 max-w-19 text-10 font-medium leading-4 text-shahrzad-ink md:mr-4 md:mt-0 md:max-w-33 md:text-15 md:font-bold">
          {tile.title}
        </span>
      </Link>
      <Drawer
        title={tile.title}
        open={open}
        placement="bottom"
        size="large"
        onClose={() => setOpen(false)}
        className="rtl-drawer"
      >
        <div className="grid grid-cols-4 gap-y-4 pb-2">
          {tile.child?.map((child) => (
            <ServiceTile key={child.id} tile={child} />
          ))}
        </div>
      </Drawer>
    </>
  );
}
