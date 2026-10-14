"use client";

import { Button } from "antd";
import Link from "next/link";
import type { ReactNode } from "react";

type SectionAction =
  | {
      href: string;
      label: string;
      onClick?: never;
    }
  | {
      href?: never;
      label: string;
      onClick: () => void;
    };

type Props = {
  action?: SectionAction;
  className?: string;
  headingLevel?: "h1" | "h2" | "h3" | "h4";
  title: ReactNode;
};

export function SectionHeader({
  action,
  className = "",
  headingLevel = "h2",
  title
}: Props) {
  const Heading = headingLevel;

  return (
    <div className={`mb-4 flex items-center gap-3 text-neutral-900 md:mb-4 ${className}`.trim()}>
      <Heading className="text-sm font-bold md:text-base">{title}</Heading>
      <span aria-hidden="true" className="h-px flex-1 bg-neutral-200" />
      {action && (
        action.href ? (
          <Link className="text-xs font-medium text-shahrzad-primary md:text-sm" href={action.href}>
            {action.label}
          </Link>
        ) : (
          <Button
            type="link"
            className="h-auto! px-0! text-xs! font-medium! md:text-sm!"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )
      )}
    </div>
  );
}
