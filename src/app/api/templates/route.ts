import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/templates — List all mockup templates
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const premium = searchParams.get("premium");

  try {
    const where: any = {};

    if (category && category !== "all") {
      where.category = category.toUpperCase();
    }

    if (search) {
      where.name = { contains: search };
    }

    if (premium === "true") {
      where.isPremium = true;
    } else if (premium === "false") {
      where.isPremium = false;
    }

    const templates = await prisma.mockupTemplate.findMany({
      where,
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
