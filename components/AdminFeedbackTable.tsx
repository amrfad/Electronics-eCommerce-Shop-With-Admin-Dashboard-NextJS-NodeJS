"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaStar, FaEye } from "react-icons/fa";
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
  const [error, setError] = useState("");
  const [viewingFeedback, setViewingFeedback] = useState<Feedback | null>(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/feedback");
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

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const handleViewFeedback = (feedback: Feedback) => {
    setViewingFeedback(feedback);
  };

  const closeViewModal = () => {
    setViewingFeedback(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Customer Feedback Management
        </h2>
        <p>Loading feedbacks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Customer Feedback Management
        </h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Customer Feedback Management</h2>
        <p className="text-gray-600 mt-1">
          View all customer feedback (Read-only for Admin)
        </p>
      </div>

      <div className="p-6">
        {feedbacks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No feedbacks found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment Preview
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
                  <tr key={feedback.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {feedback.product.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {feedback.user.email.split("@")[0]}
                      </div>
                      <div className="text-xs text-gray-500">
                        {feedback.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {renderStars(feedback.rating)}
                        <span className="text-sm text-gray-600">
                          ({feedback.rating})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {feedback.comment}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {formatDistanceToNow(new Date(feedback.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                      {feedback.updatedAt !== feedback.createdAt && (
                        <div className="text-xs text-blue-600">(edited)</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewFeedback(feedback)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                        title="View feedback details"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewingFeedback && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Feedback Details
                </h3>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    Product:
                  </span>
                  <p className="mt-1 text-sm text-gray-900">
                    {viewingFeedback.product.title}
                  </p>
                </div>

                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    Customer:
                  </span>
                  <p className="mt-1 text-sm text-gray-900">
                    {viewingFeedback.user.email}
                  </p>
                </div>

                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    Rating:
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    {renderStars(viewingFeedback.rating)}
                    <span className="text-sm text-gray-600">
                      ({viewingFeedback.rating}/5)
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    Comment:
                  </span>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {viewingFeedback.comment}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-sm font-medium text-gray-700">
                      Created:
                    </span>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(viewingFeedback.createdAt).toLocaleDateString()}{" "}
                      at{" "}
                      {new Date(viewingFeedback.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  {viewingFeedback.updatedAt !== viewingFeedback.createdAt && (
                    <div>
                      <span className="block text-sm font-medium text-gray-700">
                        Last Updated:
                      </span>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(
                          viewingFeedback.updatedAt
                        ).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(
                          viewingFeedback.updatedAt
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeViewModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackTable;
