"use client";
import React, { useState } from "react";
import { FeedbackForm, FeedbackList } from "@/components";

interface ProductFeedbackSectionProps {
  productId: string;
}

const ProductFeedbackSection: React.FC<ProductFeedbackSectionProps> = ({
  productId,
}) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFeedbackSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-5 py-16 space-y-8">
      <h2 className="text-2xl font-bold">Customer Reviews & Feedback</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <FeedbackForm
            productId={productId}
            onFeedbackSubmitted={handleFeedbackSubmitted}
          />
        </div>

        <div>
          <FeedbackList productId={productId} refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default ProductFeedbackSection;
