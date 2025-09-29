import prisma from "@/utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

// GET - Ambil feedback berdasarkan productId atau semua feedback (untuk admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const session = await getServerSession(authOptions);

    if (productId) {
      // Ambil feedback untuk produk tertentu
      const feedbacks = await prisma.feedback.findMany({
        where: { productId },
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
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ feedbacks }, { status: 200 });
    }

    // Jika admin, ambil semua feedback
    if ((session as any)?.user?.role === "admin") {
      const feedbacks = await prisma.feedback.findMany({
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
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ feedbacks }, { status: 200 });
    }

    return NextResponse.json(
      { error: "Unauthorized or missing productId parameter" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Buat feedback baru (hanya customer/user)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session as any)?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Cek role - hanya user/customer yang bisa membuat feedback
    if ((session as any)?.user?.role !== "user") {
      return NextResponse.json(
        { error: "Only customers can create feedback" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { productId, comment, rating } = body;

    // Validasi input
    if (!productId || !comment || !rating) {
      return NextResponse.json(
        { error: "Missing required fields: productId, comment, rating" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Cek apakah produk ada
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Cek apakah user sudah pernah memberi feedback untuk produk ini
    const existingFeedback = await prisma.feedback.findUnique({
      where: {
        productId_userId: {
          productId,
          userId: (session as any).user.id,
        },
      },
    });

    if (existingFeedback) {
      return NextResponse.json(
        { error: "You have already provided feedback for this product" },
        { status: 400 }
      );
    }

    // Buat feedback baru
    const feedback = await prisma.feedback.create({
      data: {
        id: nanoid(),
        productId,
        userId: (session as any).user.id,
        comment,
        rating,
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

    return NextResponse.json({ feedback }, { status: 201 });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
