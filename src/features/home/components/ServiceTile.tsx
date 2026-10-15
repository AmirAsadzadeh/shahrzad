"use client";

import { Drawer } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ServiceTile as ServiceTileType } from "@/entities/home/model/types";
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
            <span className="absolute -bottom-4 -left-[0.3rem] h-6 w-6">
              <svg
                width="23"
                height="11"
                viewBox="0 0 23 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M17.5 1C19.9853 1 22 3.01472 22 5.5C22 7.98528 19.9853 10 17.5 10H5.5C3.01472 10 1 7.98528 1 5.5C1 3.01472 3.01472 1 5.5 1H17.5Z"
                  fill="#307FE2"
                />
                <path
                  d="M17.5 1C19.9853 1 22 3.01472 22 5.5C22 7.98528 19.9853 10 17.5 10H5.5C3.01472 10 1 7.98528 1 5.5C1 3.01472 3.01472 1 5.5 1H17.5Z"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle cx="7.5" cy="5.5" r="1.5" fill="white" />
                <circle cx="11.5" cy="5.5" r="1.5" fill="white" />
                <circle cx="15.5" cy="5.5" r="1.5" fill="white" />
              </svg>
            </span>
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
