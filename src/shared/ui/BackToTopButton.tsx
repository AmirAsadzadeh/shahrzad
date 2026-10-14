"use client";

import { Button } from "antd";

type Props = {
  className?: string;
  label?: string;
  onClick: () => void;
};

export function BackToTopButton({
  className = "",
  label = "بازگشت به بالا",
  onClick,
}: Props) {
  return (
    <Button
      htmlType="button"
      type="default"
      onClick={onClick}
      className={`mr-auto! mt-4! flex! h-10 items-center justify-center whitespace-nowrap rounded-xl! border-shahrzad-action! bg-white! px-4! py-2! text-sm! font-medium! leading-5! text-shahrzad-action! md:mt-16! ${className}`.trim()}
    >
      {label}
    </Button>
  );
}
