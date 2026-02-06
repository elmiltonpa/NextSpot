"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function deleteAccount() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No estás autorizado para realizar esta acción." };
  }

  try {
    await prisma.user.delete({
      where: {
        id: session.user.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error al eliminar la cuenta:", error);
    return {
      error:
        "Hubo un error al intentar eliminar tu cuenta. Por favor, reinténtalo.",
    };
  }
}
