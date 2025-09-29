import prisma from "@/utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

interface FeedbackParams {
  params: {
    id: string;
  };
}

// PUT - Update feedback (hanya customer/owner)
export async function PUT(request: NextRequest, { params }: FeedbackParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Admin tidak boleh mengedit feedback
    if ((session as any)?.user?.role === "admin") {
      return NextResponse.json(
        { error: "Admin tidak boleh mengedit feedback" },
        { status: 403 }
      );
    }

    // Hanya customer/user yang bisa edit
    if ((session as any)?.user?.role !== "user") {
      return NextResponse.json(
        { error: "Only customers can edit feedback" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { comment, rating } = body;

    // Validasi input
    if (!comment || !rating) {
      return NextResponse.json(
        { error: "Missing required fields: comment, rating" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Ambil feedback yang akan diupdate
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!existingFeedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    // Cek ownership - hanya boleh update feedback sendiri
    if (existingFeedback.userId !== (session as any).user?.id) {
      return NextResponse.json(
        { error: "You can only update your own feedback" },
        { status: 403 }
      );
    }

    // Update feedback
    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: {
        comment,
        rating,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ feedback: updatedFeedback }, { status: 200 });
  } catch (error) {
    console.error("Error updating feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} // DELETE - Hapus feedback
export async function DELETE(request: NextRequest, { params }: FeedbackParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Admin tidak boleh menghapus feedback
    if ((session as any)?.user?.role === "admin") {
      return NextResponse.json(
        { error: "Admin tidak boleh menghapus feedback" },
        { status: 403 }
      );
    }

    // Hanya customer/user yang bisa delete
    if ((session as any)?.user?.role !== "user") {
      return NextResponse.json(
        { error: "Only customers can delete feedback" },
        { status: 403 }
      );
    }

    // Ambil feedback yang akan dihapus
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!existingFeedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    // Cek ownership - hanya boleh hapus feedback sendiri
    if (existingFeedback.userId !== (session as any).user?.id) {
      return NextResponse.json(
        { error: "You can only delete your own feedback" },
        { status: 403 }
      );
    }

    // Hapus feedback
    await prisma.feedback.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Feedback deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
