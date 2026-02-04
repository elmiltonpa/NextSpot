"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getHistory() {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, data: [] };
  }

  try {
    const history = await prisma.searchHistory.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return { success: true, data: history };
  } catch {
    return { success: false, data: [] };
  }
}
