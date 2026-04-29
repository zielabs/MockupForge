require("dotenv").config();

async function testWebhook() {
  // You can change this to test different users or amounts
  const testEmail = "test@example.com"; 
  const testAmount = 500000; // >400k means PRO_YEARLY, <400k means PRO_MONTHLY

  const payload = {
    event: "payment.success",
    data: {
      transaction_id: `tx_test_${Date.now()}`,
      order_id: `order_test_${Date.now()}`,
      amount: testAmount,
      email: testEmail,
      // Metadata/plan_code are optional now since we fallback to amount
      // plan_code: "PRO_MONTHLY"
    },
  };

  const webhookSecret = process.env.MAYAR_WEBHOOK_SECRET;

  try {
    const res = await fetch("http://localhost:3000/api/webhooks/mayar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Pass the actual secret to bypass validation
        "x-mayar-signature": webhookSecret || "test-signature", 
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    
    if (res.ok) {
      console.log("✅ Webhook simulation successful!");
      console.log("Response:", data);
      console.log(`\nPlease check the database to see if ${testEmail} has been upgraded.`);
    } else {
      console.error("❌ Webhook simulation failed!");
      console.error("Status:", res.status);
      console.error("Error:", data);
    }
  } catch (err) {
    console.error("❌ Failed to reach the server. Make sure your local Next.js server is running on http://localhost:3000.");
    console.error(err);
  }
}

testWebhook();
