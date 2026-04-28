import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/subscription — Get current user's subscription
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      include: {
        payments: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!subscription) {
      return NextResponse.json({
        subscription: {
          plan: "FREE",
          status: "ACTIVE",
        },
      });
    }

    // Check if subscription has expired
    if (subscription.endDate && new Date() > subscription.endDate) {
      if (subscription.status === "ACTIVE") {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: "EXPIRED",
            plan: "FREE",
          },
        });
        subscription.status = "EXPIRED";
        subscription.plan = "FREE";
      }
    }

    // Get usage count
    const mockupUsageCount = await prisma.mockupUsage.count({
      where: { userId: session.user.id },
    });

    const projectCount = await prisma.project.count({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      subscription,
      usage: {
        mockupsUsed: mockupUsageCount,
        mockupsLimit: subscription.plan === "FREE" ? 3 : null,
        projectCount,
        projectLimit: subscription.plan === "FREE" ? 0 : subscription.plan === "PRO_MONTHLY" ? 50 : 200,
      },
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
