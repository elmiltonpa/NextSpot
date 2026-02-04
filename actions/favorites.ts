"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function toggleFavorite(place: {
  googlePlaceId: string;
  name: string;
  address?: string;
  image?: string;
  rating?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Debes iniciar sesión" };
  }

  const userId = session.user.id;

  try {
    const existing = await prisma.savedPlace.findUnique({
      where: {
        userId_googlePlaceId: {
          userId,
          googlePlaceId: place.googlePlaceId,
        },
      },
    });

    if (existing) {
      await prisma.savedPlace.delete({
        where: { id: existing.id },
      });
      return { success: true, isFavorite: false };
    } else {
      await prisma.savedPlace.create({
        data: {
          userId,
          googlePlaceId: place.googlePlaceId,
          name: place.name,
          address: place.address,
          image: place.image,
          rating: place.rating,
        },
      });
      return { success: true, isFavorite: true };
    }
  } catch {
    return { success: false, error: "Error al actualizar favoritos" };
  }
}

export async function checkFavorite(googlePlaceId: string) {
  const session = await auth();
  if (!session?.user?.id) return false;

  const count = await prisma.savedPlace.count({
    where: {
      userId: session.user.id,
      googlePlaceId,
    },
  });

  return count > 0;
}

export async function getFavorites() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    return await prisma.savedPlace.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}
