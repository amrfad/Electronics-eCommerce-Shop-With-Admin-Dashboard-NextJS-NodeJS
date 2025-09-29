"use client";
import { AdminFeedbackTable, DashboardSidebar } from "@/components";
import React from "react";

const AdminFeedbackPage = () => {
  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1">
        <AdminFeedbackTable />
      </div>
    </div>
  );
};

export default AdminFeedbackPage;
