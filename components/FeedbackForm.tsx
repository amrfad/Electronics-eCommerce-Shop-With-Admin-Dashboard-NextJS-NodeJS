"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { FaStar, FaRegStar } from "react-icons/fa";

interface FeedbackFormProps {
  productId: string;
  onFeedbackSubmitted: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  productId,
  onFeedbackSubmitted,
}) => {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please login to submit feedback");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter your comment");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          comment: comment.trim(),
          rating,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Feedback submitted successfully!");
        setComment("");
        setRating(0);
        onFeedbackSubmitted();
      } else {
        toast.error(data.error || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Customer Feedback</h3>
        <p className="text-gray-600">
          Please{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            login
          </a>{" "}
          to submit your feedback.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Write Your Feedback</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Rating
          </label>
          <div
            className="flex space-x-1"
            role="radiogroup"
            aria-labelledby="rating"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="text-2xl focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
              >
                {star <= (hoverRating || rating) ? (
                  <FaStar className="text-yellow-400" />
                ) : (
                  <FaRegStar className="text-gray-300" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Comment
          </label>
          <textarea
            id="comment"
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
