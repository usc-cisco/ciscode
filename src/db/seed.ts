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
    const [lastname, firstname, id] = line.split(",").map(field => field.trim());


    return { 
      username: Number(id), 
      name: firstname + " " + lastname,
      password: bcrypt.hashSync(lastname.toLowerCase() + id, 10),
      role: RoleEnum.USER,
    };
  });

  await User.bulkCreate(students, {
    ignoreDuplicates: true
  });

  console.log(`Seeded ${students.length} students.`);
  process.exit(0);
})();
