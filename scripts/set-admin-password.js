/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    content.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const [key, ...values] = trimmed.split("=");
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join("=").trim();
      }
    });
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not set in .env.local");
  process.exit(1);
}

if (!ADMIN_EMAIL) {
  console.error("Error: ADMIN_EMAIL is not set in .env.local");
  process.exit(1);
}

const newPassword = process.argv[2] || process.env.ADMIN_PASSWORD;

if (!newPassword || newPassword.length < 6) {
  console.error("Error: Please provide a password of at least 6 characters.");
  console.error("Usage: node scripts/set-admin-password.js <your-password>");
  console.error("Or set ADMIN_PASSWORD in .env.local");
  process.exit(1);
}

async function run() {
  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(MONGODB_URI);
  console.log(`Setting password for admin: ${ADMIN_EMAIL}...`);

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  const usersCollection = mongoose.connection.db.collection("users");

  const result = await usersCollection.updateOne(
    { email: ADMIN_EMAIL },
    {
      $set: {
        password: hashedPassword,
        role: "admin",
        isEmailVerified: true,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        name: "Admin",
        email: ADMIN_EMAIL,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  if (result.upsertedCount > 0) {
    console.log(`✓ Created new admin user: ${ADMIN_EMAIL}`);
  } else {
    console.log(`✓ Updated existing user ${ADMIN_EMAIL} with role 'admin' and the new password.`);
  }

  console.log("Admin credentials login is now ready!");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Failed to set admin password:", err);
  process.exit(1);
});
