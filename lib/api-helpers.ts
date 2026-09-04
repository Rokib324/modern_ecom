import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export function jsonResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function errorResponse(error: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}

export function formatZodError(error: { issues: Array<{ message: string }> }): string {
  return error.issues[0]?.message || "Invalid input";
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return {
      session: null,
      user: null,
      errorResponse: errorResponse("Unauthorized: Please sign in to proceed", 401),
    };
  }

  return {
    session,
    user: session.user,
    errorResponse: null,
  };
}

export async function requireAdmin() {
  const { session, user, errorResponse: authError } = await requireAuth();
  if (authError || !user) {
    return {
      session: null,
      user: null,
      errorResponse: authError,
    };
  }

  if (user.role !== "admin") {
    return {
      session,
      user,
      errorResponse: errorResponse("Forbidden: Admin access required", 403),
    };
  }

  return {
    session,
    user,
    errorResponse: null,
  };
}
