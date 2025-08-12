import { sequelize } from "@/db/sequelize";
import { User } from "@/models/user.model";
import { readFile } from "fs/promises";
import { join } from "path";
import * as bcrypt from "bcryptjs";
import RoleEnum from "@/lib/types/enums/role.enum";

(async () => {
  await sequelize.sync(); // ensure DB is ready

  const studentDataText = await readFile(join(__dirname, "data", "students.txt"), "utf-8")

  const students = studentDataText.split("\n").map(line => {
    const [name, id] = line.split(",").map(field => field.trim());
    const lastName = name.split(" ").pop() ?? "";
    return { 
      username: Number(id), 
      name,
      password: bcrypt.hashSync(lastName.toLowerCase() + id, 10),
      role: RoleEnum.USER,
    };
  });

  await User.bulkCreate(students, {
    ignoreDuplicates: true
  });

  console.log(`Seeded ${students.length} students.`);
  process.exit(0);
})();
