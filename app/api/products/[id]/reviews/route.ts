import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { requireAuth, errorResponse, formatZodError } from "@/lib/api-helpers";
import { reviewCreateSchema } from "@/lib/validations";

// POST /api/products/[id]/reviews — add review & recalculate rating
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse: authError } = await requireAuth();
    if (authError || !user) return authError;

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const parsed = reviewCreateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(formatZodError(parsed.error), 400);
    }

    const product = await Product.findById(id);
    if (!product) {
      return errorResponse("Product not found", 404);
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.some(
      (r) => r.user.toString() === user.id
    );
    if (alreadyReviewed) {
      return errorResponse("You have already reviewed this product", 400);
    }

    const review = {
      user: new mongoose.Types.ObjectId(user.id),
      name: user.name || "Customer",
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      createdAt: new Date(),
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    return NextResponse.json(
      {
        success: true,
        message: "Review added successfully",
        data: {
          rating: product.rating,
          numReviews: product.numReviews,
          reviews: product.reviews,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Product review POST error:", error);
    return errorResponse("Failed to submit review", 500);
  }
}

// DELETE /api/products/[id]/reviews?reviewId=xxx — remove a review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse: authError } = await requireAuth();
    if (authError || !user) return authError;

    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return errorResponse("Review ID is required", 400);
    }

    const product = await Product.findById(id);
    if (!product) {
      return errorResponse("Product not found", 404);
    }

    // Find review index
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reviewIndex = product.reviews.findIndex((r: any) => r._id.toString() === reviewId);
    if (reviewIndex === -1) {
      return errorResponse("Review not found", 404);
    }

    const review = product.reviews[reviewIndex];

    // Authorization: only the review author or an admin can delete
    if (review.user.toString() !== user.id && user.role !== "admin") {
      return errorResponse("Forbidden: You cannot delete this review", 403);
    }

    product.reviews.splice(reviewIndex, 1);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length
        : 0;

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Review removed successfully",
      data: {
        rating: product.rating,
        numReviews: product.numReviews,
      },
    });
  } catch (error) {
    console.error("Product review DELETE error:", error);
    return errorResponse("Failed to remove review", 500);
  }
}
