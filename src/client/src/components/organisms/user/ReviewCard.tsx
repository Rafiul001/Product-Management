import { updateReviewApi } from "@/api/reviewApi";
import { Rating } from "@/components/Icons/Ratings";
import StarPicker from "@/components/molecules/StarPicker";
import type { TReviewDocument } from "@shared/models/Review";
import { isAxiosError } from "axios";
import type React from "react";
import { useState } from "react";

export type TPopulatedReview = Omit<TReviewDocument, "user"> & {
  user: { _id: string; userName: string };
  createdAt: string;
  updatedAt: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  review: TPopulatedReview;
  isOwn: boolean;
  onUpdated: () => void;
};

const ReviewCard: React.FC<Props> = ({ review, isOwn, onUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isEdited = review.updatedAt !== review.createdAt;

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await updateReviewApi(review._id.toString(), {
        rating: editRating || undefined,
        comment: editComment || undefined,
      });
      setIsEditing(false);
      onUpdated();
    } catch (err) {
      if (isAxiosError<{ message: string }>(err)) {
        setSaveError(err.response?.data.message ?? "Failed to save.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditRating(review.rating);
    setEditComment(review.comment ?? "");
    setSaveError(null);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
            {review.user?.userName?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-800 text-sm leading-tight">
              {review.user?.userName ?? "Anonymous"}
            </span>
            <span className="text-xs text-gray-400 leading-tight">
              {isEdited
                ? `Edited ${formatDate(review.updatedAt)}`
                : formatDate(review.createdAt)}
            </span>
          </div>
          {isEdited && (
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-medium">
              Edited
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && <Rating rating={review.rating} className="w-20" />}
          {isOwn && !isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs text-primary-500 hover:text-primary-700 font-medium"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-3 mt-2">
          <StarPicker value={editRating} onChange={setEditRating} />
          <textarea
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Update your comment..."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-primary-400 resize-none"
          />
          {saveError && <p className="text-xs text-danger-500">{saveError}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || editRating === 0}
              className="text-xs font-semibold px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="text-xs font-semibold px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        review.comment && (
          <p className="text-sm text-gray-600 leading-relaxed">
            {review.comment}
          </p>
        )
      )}
    </div>
  );
};

export default ReviewCard;
