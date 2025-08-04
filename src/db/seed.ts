import { sequelize } from "@/db/sequelize";

(async () => {
  await sequelize.sync(); // ensure DB is ready

  // Seed logic here

  console.log("✅ Seeding complete.");
  process.exit(0);
})();
