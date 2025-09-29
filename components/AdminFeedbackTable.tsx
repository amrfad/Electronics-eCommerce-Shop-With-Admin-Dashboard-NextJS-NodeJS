"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { FaStar, FaEdit, FaTrash, FaEye } from "react-icons/fa";
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
  product: {
    id: string;
    title: string;
  };
}

const AdminFeedbackTable: React.FC = () => {
  const { data: session } = useSession();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete">(
    "view"
  );
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/feedback");
      const data = await response.json();

      if (response.ok) {
        setFeedbacks(data.feedbacks);
      } else {
        toast.error(data.error || "Failed to fetch feedbacks");
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

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

  const openModal = (feedback: Feedback, type: "view" | "edit" | "delete") => {
    setSelectedFeedback(feedback);
    setModalType(type);
    if (type === "edit") {
      setEditComment(feedback.comment);
      setEditRating(feedback.rating);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFeedback(null);
    setEditComment("");
    setEditRating(0);
    setIsSubmitting(false);
  };

  const handleEdit = async () => {
    if (!selectedFeedback) return;

    if (!editComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (editRating < 1 || editRating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/feedback/${selectedFeedback.id}`, {
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
        closeModal();
        fetchFeedbacks();
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

  const handleDelete = async () => {
    if (!selectedFeedback) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/feedback/${selectedFeedback.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Feedback deleted successfully!");
        closeModal();
        fetchFeedbacks();
      } else {
        toast.error(data.error || "Failed to delete feedback");
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          Customer Feedback Management
        </h2>
        <p>Loading feedbacks...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customer Feedback Management</h2>

      {feedbacks.length === 0 ? (
        <p className="text-gray-600">No feedbacks found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feedbacks.map((feedback) => (
                <tr key={feedback.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {feedback.product.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {feedback.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStars(feedback.rating)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {feedback.comment}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDistanceToNow(new Date(feedback.createdAt), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openModal(feedback, "view")}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => openModal(feedback, "edit")}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openModal(feedback, "delete")}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedFeedback && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {modalType === "view" && "View Feedback"}
                {modalType === "edit" && "Edit Feedback"}
                {modalType === "delete" && "Delete Feedback"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedFeedback.product.title}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedFeedback.user.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rating
                </label>
                {modalType === "edit" ? (
                  <div className="flex space-x-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-xl focus:outline-none"
                        onClick={() => setEditRating(star)}
                      >
                        <FaStar
                          className={
                            star <= editRating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-1">
                    {renderStars(selectedFeedback.rating)}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Comment
                </label>
                {modalType === "edit" ? (
                  <textarea
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedFeedback.comment}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDistanceToNow(new Date(selectedFeedback.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              {modalType === "edit" && (
                <button
                  onClick={handleEdit}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </button>
              )}

              {modalType === "delete" && (
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackTable;
