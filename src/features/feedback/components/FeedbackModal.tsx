"use client";

import { Button, Input, Modal } from "antd";
import { Happyemoji, Like1, MessageText } from "iconsax-react";
import { useEffect, useState } from "react";
import { getFeedbackVisibility, submitFeedback, type FeedbackRating } from "@/features/feedback/api/feedbackApi";
import { getErrorMessage } from "@/shared/api/errors";

const ratingOptions: { key: FeedbackRating; label: string; icon: typeof Like1 }[] = [
  { key: "good", label: "خوب", icon: Like1 },
  { key: "normal", label: "معمولی", icon: MessageText },
  { key: "bad", label: "بد", icon: Happyemoji }
];

export function FeedbackModal() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getFeedbackVisibility()
      .then((result) => setOpen(result.showModal))
      .catch(() => undefined);
  }, []);

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      if (!rating) return;
      await submitFeedback({ rating, description });
      setDone(true);
    } catch (submitError) {
      setError(getErrorMessage(submitError, "ثبت بازخورد انجام نشد."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={done ? "نظر شما ثبت شد" : "نظرسنجی کاربران"} open={open} footer={null} onCancel={() => setOpen(false)} destroyOnHidden>
      {done ? (
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="text-sm leading-7 text-neutral-600">
            ممنونیم که وقت گذاشتی. بازخورد شما به بهتر شدن شهرزاد کمک می‌کند.
          </p>
          <Button type="primary" block onClick={() => setOpen(false)}>
            بستن
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <p className="text-center text-sm leading-7 text-neutral-600">
            خوشحال می‌شیم تجربه‌ی استفاده از شهرزاد رو با ما به اشتراک بذاری.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {ratingOptions.map((option) => {
              const Icon = option.icon;
              const selected = rating === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setRating(option.key)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm font-semibold transition ${
                    selected ? "border-shahrzad-primary bg-shahrzad-primary-soft text-shahrzad-primary" : "border-neutral-200 bg-neutral-50"
                  }`}
                >
                  <Icon size={30} variant="Bulk" />
                  {option.label}
                </button>
              );
            })}
          </div>
          {rating && rating !== "good" && (
            <Input.TextArea
              aria-label="توضیحات بازخورد"
              autoSize={{ minRows: 3, maxRows: 5 }}
              placeholder="دیدگاه خود را بنویسید"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          )}
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <Button type="primary" block disabled={!rating} loading={submitting} onClick={submit}>
            ثبت بازخورد
          </Button>
        </div>
      )}
    </Modal>
  );
}
