import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/webhooks/mayar — Handle Mayar payment webhook
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = req.headers.get("x-mayar-signature");

    // Verify webhook signature
    const webhookSecret = process.env.MAYAR_WEBHOOK_SECRET;
    if (webhookSecret && signature !== webhookSecret) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const { event, data } = body;

    switch (event) {
      case "payment.success": {
        const { email, transaction_id, order_id, amount, plan_code, customer_id, license_key, metadata } = data;

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
          include: { subscription: true },
        });

        if (!user) {
          console.error(`User not found for email: ${email}`);
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Determine plan from Mayar plan_code, metadata, or amount fallback
        let plan: any = "PRO_MONTHLY";
        if (plan_code) {
          plan = plan_code.includes("yearly") ? "PRO_YEARLY" : "PRO_MONTHLY";
        } else if (metadata?.plan_code) {
          plan = metadata.plan_code;
        } else if (amount) {
          plan = amount >= 400000 ? "PRO_YEARLY" : "PRO_MONTHLY";
        }
        const endDate = new Date();
        if (plan === "PRO_YEARLY") {
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
          endDate.setMonth(endDate.getMonth() + 1);
        }

        // Update or create subscription
        await prisma.subscription.upsert({
          where: { userId: user.id },
          update: {
            plan,
            status: "ACTIVE",
            mayarCustomerId: data.customer_id,
            mayarLicenseKey: data.license_key,
            startDate: new Date(),
            endDate,
          },
          create: {
            userId: user.id,
            plan,
            status: "ACTIVE",
            mayarCustomerId: data.customer_id,
            mayarLicenseKey: data.license_key,
            startDate: new Date(),
            endDate,
          },
        });

        // Record payment
        const subscription = await prisma.subscription.findUnique({
          where: { userId: user.id },
        });

        if (subscription) {
          await prisma.payment.create({
            data: {
              subscriptionId: subscription.id,
              amount: amount || 0,
              currency: "IDR",
              status: "SUCCESS",
              mayarTransactionId: transaction_id,
              mayarOrderId: order_id,
              paidAt: new Date(),
            },
          });
        }

        console.log(`Payment success for ${email}, plan: ${plan}`);
        break;
      }

      case "subscription.cancelled": {
        const { email } = data;
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          await prisma.subscription.update({
            where: { userId: user.id },
            data: {
              status: "CANCELLED",
            },
          });
          console.log(`Subscription cancelled for ${email}`);
        }
        break;
      }

      case "subscription.expired": {
        const { email } = data;
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          await prisma.subscription.update({
            where: { userId: user.id },
            data: {
              status: "EXPIRED",
              plan: "FREE",
            },
          });
          console.log(`Subscription expired for ${email}`);
        }
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
