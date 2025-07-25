import { sequelize } from "@/db/sequelize";
import { User } from "@/models/user.model";

(async () => {
  await sequelize.sync(); // ensure DB is ready

  // Seed logic here

  console.log("✅ Seeding complete.");
  process.exit(0);
})();
