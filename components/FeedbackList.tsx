"use client";
import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

interface Feedback {
  id: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
  };
}

interface FeedbackListProps {
  productId: string;
  refreshTrigger: number;
}

const FeedbackList: React.FC<FeedbackListProps> = ({
  productId,
  refreshTrigger,
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/feedback?productId=${productId}`);
        const data = await response.json();

        if (response.ok) {
          setFeedbacks(data.feedbacks);
          setError("");
        } else {
          setError(data.error || "Failed to fetch feedbacks");
        }
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError("Failed to fetch feedbacks");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [productId, refreshTrigger]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Customer Feedback</h3>
        <p>Loading feedbacks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Customer Feedback</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">
        Customer Feedback ({feedbacks.length})
      </h3>

      {feedbacks.length === 0 ? (
        <p className="text-gray-600">
          No feedback yet. Be the first to share your experience!
        </p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="border-b border-gray-200 pb-4 last:border-b-0"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {renderStars(feedback.rating)}
                    <span className="text-sm text-gray-600">
                      by {feedback.user.email.split("@")[0]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(feedback.createdAt), {
                      addSuffix: true,
                    })}
                    {feedback.updatedAt !== feedback.createdAt && " (edited)"}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{feedback.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
