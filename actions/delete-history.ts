"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteHistoryItem(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  try {
    const item = await prisma.searchHistory.findUnique({
      where: { id },
    });

    if (!item || item.userId !== session.user.id) {
      return { error: "No tienes permiso para eliminar este elemento" };
    }

    await prisma.searchHistory.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar historial:", error);
    return { error: "Error al eliminar el elemento del historial" };
  }
}
