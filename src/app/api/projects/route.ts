import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/projects — List user's projects
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      include: {
        template: {
          select: { name: true, category: true, thumbnailUrl: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects — Create a new project
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { templateId, name, designConfig } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      );
    }

    // Check free tier limit
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription || subscription.plan === "FREE") {
      const usageCount = await prisma.mockupUsage.count({
        where: { userId: session.user.id },
      });

      if (usageCount >= 3) {
        return NextResponse.json(
          { error: "Free tier limit reached. Please upgrade to Pro." },
          { status: 403 }
        );
      }
    }

    // Get the template — try by ID first, then by slug
    let template = await prisma.mockupTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      template = await prisma.mockupTemplate.findUnique({
        where: { slug: templateId },
      });
    }

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Check if premium template requires Pro subscription
    if (template.isPremium && (!subscription || subscription.plan === "FREE")) {
      return NextResponse.json(
        { error: "Premium templates require a Pro subscription." },
        { status: 403 }
      );
    }

    // Create project and usage tracking
    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        templateId: template.id,
        name: name || "Untitled Project",
        designConfig: designConfig || undefined,
        usage: {
          create: {
            userId: session.user.id,
            productType: template.category,
          },
        },
      },
      include: {
        template: true,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
