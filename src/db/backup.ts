import mysqldump from "mysqldump";

async function backupDatabase() {
  try {
    await mysqldump({
      connection: {
        host: process.env.DB_HOST!,
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
      },
      dumpToFile: "./db-backup.sql",
    });
    console.log("Database backup completed successfully.");
  } catch (error) {
    console.error("Error during database backup:", error);
  }
}

backupDatabase();
