import mysqldump from "mysqldump";
import fs from "fs";
import path from "path";

const BACKUP_DIR = "./backups";
const MAX_BACKUPS = 10;

async function backupDatabase() {
  try {
    // If backup directory does NOT exist, create it
    if (!fs.existsSync(BACKUP_DIR)) {
      console.log("Backup directory not found. Creating...");
      fs.mkdirSync(BACKUP_DIR, { recursive: true });

      // Optional: indicate this is the first/initial backup
      console.log("Created backup directory. Performing initial backup...");
    }

    // Create timestamped filename
    const timestamp = new Date()
      .toISOString()
      .replace(/[:]/g, "-")
      .replace(/\..+/, "");

    const backupFile = path.join(BACKUP_DIR, `db-${timestamp}.sql`);

    // Perform backup
    await mysqldump({
      connection: {
        host: process.env.DB_HOST!,
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
      },
      dumpToFile: backupFile,
    });

    console.log(`Backup created: ${backupFile}`);

    // After backup, clean up old ones
    cleanupOldBackups();
  } catch (error) {
    console.error("Error during database backup:", error);
  }
}

function cleanupOldBackups() {
  if (!fs.existsSync(BACKUP_DIR)) return;

  const files = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.endsWith(".sql"))
    .map((f) => ({
      name: f,
      time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time); // newest → oldest

  if (files.length <= MAX_BACKUPS) return;

  const filesToDelete = files.slice(MAX_BACKUPS);

  for (const file of filesToDelete) {
    const filePath = path.join(BACKUP_DIR, file.name);
    fs.unlinkSync(filePath);
    console.log(`Deleted old backup: ${file.name}`);
  }
}

backupDatabase();
