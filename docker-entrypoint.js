#!/usr/bin/env node

import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));

// Run database migrations
console.log("Running database migrations...");
const migrateProcess = spawn("npm", ["run", "db:migrate"], {
  stdio: "inherit",
});

migrateProcess.on("close", (code) => {
  if (code !== 0) {
    console.error(`Migration failed with exit code ${code}`);
    process.exit(code);
  }

  // Seed database if needed
  console.log("Seeding database...");
  const seedProcess = spawn("npm", ["run", "db:seed"], {
    stdio: "inherit",
  });

  seedProcess.on("close", (seedCode) => {
    if (seedCode !== 0) {
      console.error(`Seeding failed with exit code ${seedCode}`);
      process.exit(seedCode);
    }

    // Start the application
    console.log("Starting Remix Recipes application...");
    const startProcess = spawn("npm", ["start"], {
      stdio: "inherit",
    });

    startProcess.on("close", (startCode) => {
      process.exit(startCode);
    });
  });
});