import { Button } from "antd";
import { ArrowRight2 } from "iconsax-react";

type Props = {
  onBack: () => void;
  title: string;
};

export function NestedPageHeading({ onBack, title }: Props) {
  return (
    <div className="mb-6 hidden items-center gap-1 md:flex">
      <Button
        type="text"
        aria-label="بازگشت"
        icon={<ArrowRight2 size={24} color="currentColor" />}
        onClick={onBack}
        className="h-8! w-8! min-w-0! p-0! text-neutral-900!"
      />
      <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
    </div>
  );
}
