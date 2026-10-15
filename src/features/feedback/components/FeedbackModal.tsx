"use client";

import { Button, Input, Modal } from "antd";
import { Happyemoji, Like1, MessageText } from "iconsax-react";
import { useState } from "react";
import type { FeedbackRating } from "@/features/feedback/api/feedbackApi";
import { useFeedbackVisibility } from "@/features/feedback/hooks/useFeedbackVisibility";
import { useSubmitFeedback } from "@/features/feedback/hooks/useSubmitFeedback";
import { getErrorMessage } from "@/shared/api/errors";

const ratingOptions: {
  key: FeedbackRating;
  label: string;
  icon: typeof Like1;
}[] = [
  { key: "good", label: "خوب", icon: Like1 },
  { key: "normal", label: "معمولی", icon: MessageText },
  { key: "bad", label: "بد", icon: Happyemoji },
];

export function FeedbackModal() {
  const { shouldShow } = useFeedbackVisibility();
  const {
    error: submissionError,
    isSubmitting,
    reset: resetSubmission,
    submit,
  } = useSubmitFeedback();
  const [dismissed, setDismissed] = useState(false);
  const [done, setDone] = useState(false);
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [description, setDescription] = useState("");

  const handleRatingChange = (nextRating: FeedbackRating) => {
    resetSubmission();
    setRating(nextRating);
  };

  const handleSubmit = async () => {
    if (!rating) return;

    try {
      await submit({ rating, description });
      setDone(true);
    } catch {
      // Mutation state exposes the normalized request error below.
    }
  };

  const open = shouldShow && !dismissed;

  return (
    <Modal
      title={done ? "نظر شما ثبت شد" : "نظرسنجی کاربران"}
      open={open}
      footer={null}
      onCancel={() => setDismissed(true)}
      destroyOnHidden
    >
      {done ? (
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="text-sm leading-7 text-neutral-600">
            ممنونیم که وقت گذاشتی. بازخورد شما به بهتر شدن شهرزاد کمک می‌کند.
          </p>
          <Button type="primary" block onClick={() => setDismissed(true)}>
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
                  onClick={() => handleRatingChange(option.key)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm font-semibold transition ${
                    selected
                      ? "border-shahrzad-primary bg-shahrzad-primary-soft text-shahrzad-primary"
                      : "border-neutral-200 bg-neutral-50"
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
          {submissionError && (
            <p role="alert" className="text-sm text-red-600">
              {getErrorMessage(submissionError, "ثبت بازخورد انجام نشد.")}
            </p>
          )}
          <Button
            type="primary"
            block
            disabled={!rating}
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            ثبت بازخورد
          </Button>
        </div>
      )}
    </Modal>
  );
}
