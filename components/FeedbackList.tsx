"use client";
import React, { useState, useEffect } from "react";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

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
  const { data: session } = useSession();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingFeedback, setEditingFeedback] = useState<string | null>(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const renderEditStars = (
    rating: number,
    onRatingChange: (rating: number) => void
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`cursor-pointer ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } hover:text-yellow-400`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  const handleEditClick = (feedback: Feedback) => {
    setEditingFeedback(feedback.id);
    setEditComment(feedback.comment);
    setEditRating(feedback.rating);
  };

  const handleEditCancel = () => {
    setEditingFeedback(null);
    setEditComment("");
    setEditRating(0);
  };

  const handleEditSubmit = async (feedbackId: string) => {
    if (!editComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    if (editRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: editComment.trim(),
          rating: editRating,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Feedback updated successfully!");
        setEditingFeedback(null);
        setEditComment("");
        setEditRating(0);

        // Refresh feedbacks
        const fetchResponse = await fetch(
          `/api/feedback?productId=${productId}`
        );
        const fetchData = await fetchResponse.json();
        if (fetchResponse.ok) {
          setFeedbacks(fetchData.feedbacks);
        }
      } else {
        toast.error(data.error || "Failed to update feedback");
      }
    } catch (error) {
      console.error("Error updating feedback:", error);
      toast.error("Failed to update feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (feedbackId: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) {
      return;
    }

    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Feedback deleted successfully!");

        // Refresh feedbacks
        const fetchResponse = await fetch(
          `/api/feedback?productId=${productId}`
        );
        const fetchData = await fetchResponse.json();
        if (fetchResponse.ok) {
          setFeedbacks(fetchData.feedbacks);
        }
      } else {
        toast.error(data.error || "Failed to delete feedback");
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback");
    }
  };

  // Check if current user can edit/delete this feedback
  const canModifyFeedback = (feedback: Feedback) => {
    // Only the owner can modify feedback (users only, not admin)
    const user = session?.user as any;

    // Debug logging untuk troubleshooting
    console.log("Debug canModifyFeedback:", {
      sessionUser: user,
      feedbackUser: feedback.user,
      userIdMatch: user?.id === feedback.user.id,
      userRole: user?.role,
      isNotAdmin: user?.role !== "admin",
    });

    return user?.id === feedback.user.id && user?.role !== "admin";
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
              {editingFeedback === feedback.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Rating:</span>
                    {renderEditStars(editRating, setEditRating)}
                  </div>

                  <div>
                    <label
                      htmlFor={`comment-${feedback.id}`}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Comment:
                    </label>
                    <textarea
                      id={`comment-${feedback.id}`}
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Share your experience with this product..."
                      maxLength={1000}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {editComment.length}/1000 characters
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSubmit(feedback.id)}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Updating..." : "Update"}
                    </button>
                    <button
                      onClick={handleEditCancel}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
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
                        {feedback.updatedAt !== feedback.createdAt &&
                          " (edited)"}
                      </p>
                    </div>

                    {/* Show Edit/Delete buttons only for feedback owner (customers only) */}
                    {canModifyFeedback(feedback) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(feedback)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit feedback"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(feedback.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete feedback"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700">{feedback.comment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
