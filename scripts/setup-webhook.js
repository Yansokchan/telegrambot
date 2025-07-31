// Script to set up webhook URL after deploying to Vercel
require("dotenv").config({ path: ".env.local" });

const https = require("https");

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_URL = process.argv[2]; // Pass the URL as command line argument

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN not found in .env.local");
  process.exit(1);
}

if (!WEBHOOK_URL) {
  console.error("❌ Please provide the webhook URL as an argument");
  console.error(
    "Usage: node scripts/setup-webhook.js https://your-app.vercel.app/api/bot"
  );
  process.exit(1);
}

const webhookUrl = `${WEBHOOK_URL}`;
const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${encodeURIComponent(
  webhookUrl
)}`;

console.log("🔗 Setting up webhook...");
console.log("Bot Token:", BOT_TOKEN ? "✅ Found" : "❌ Missing");
console.log("Webhook URL:", webhookUrl);

https
  .get(apiUrl, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const result = JSON.parse(data);

        if (result.ok) {
          console.log("✅ Webhook set successfully!");
          console.log("📋 Webhook Info:", result.result);

          // Test the webhook
          console.log("\n🧪 Testing webhook...");
          const testUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`;

          https.get(testUrl, (testRes) => {
            let testData = "";
            testRes.on("data", (chunk) => (testData += chunk));
            testRes.on("end", () => {
              const testResult = JSON.parse(testData);
              console.log("📊 Webhook Status:", testResult.result);
            });
          });
        } else {
          console.error("❌ Failed to set webhook:", result.description);
        }
      } catch (error) {
        console.error("❌ Error parsing response:", error);
      }
    });
  })
  .on("error", (error) => {
    console.error("❌ Error setting webhook:", error.message);
  });
