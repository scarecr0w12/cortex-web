import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ProfileUpdateSchema = z.object({
  bio: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal("")),
  avatar: z.string().url().optional().or(z.literal("")),
});

export async function GET(request: NextRequest) {
  const { user, errorResponse } = await authenticateRequest(request);
  if (errorResponse) return errorResponse;
  return Response.json({ user });
}

export async function PUT(request: NextRequest) {
  const { user: authUser, errorResponse } = await authenticateRequest(request);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const data = ProfileUpdateSchema.parse(body);

    const updateData: Record<string, string | null> = {};
    if (data.bio !== undefined) updateData.bio = data.bio || null;
    if (data.website !== undefined) updateData.website = data.website || null;
    if (data.avatar !== undefined) updateData.avatar = data.avatar || null;

    if (Object.keys(updateData).length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: authUser.id },
      data: updateData,
    });

    const updatedUser = { ...authUser };
    if ("bio" in updateData) updatedUser.bio = updateData.bio;
    if ("website" in updateData) updatedUser.website = updateData.website;
    if ("avatar" in updateData) updatedUser.avatar = updateData.avatar;
    return Response.json({ user: updatedUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
