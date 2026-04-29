import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();

    const isYearly = plan === "yearly";
    const amount = isYearly ? 499000 : 49000;
    const name = isYearly ? "MockupForge Pro Yearly" : "MockupForge Pro Monthly";

    const response = await fetch("https://api.mayar.id/hl/v1/payment/create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.MAYAR_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description: `Subscription to ${name}`,
        amount,
        customer_name: session.user.name || "Customer",
        email: session.user.email,
        mobile: "000000000000", // Dummy required field
      }),
    });

    const data = await response.json();

    if (data.statusCode === 200) {
      return NextResponse.json({ url: data.data.link });
    } else {
      console.error("Mayar API error:", data);
      return NextResponse.json({ error: "Failed to create payment link" }, { status: 400 });
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
