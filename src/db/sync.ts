import { User } from "@/models/user.model";
import { Problem } from "@/models/problem.model";
import { defineAssociations } from "@/models";
import { TestCase } from "@/models/testcase.model";

defineAssociations();

(async () => {
    await User.sync({ alter: true });
    await Problem.sync({ alter: true });
    await TestCase.sync({ alter: true });
    console.log("Database synced.");

    console.log(Problem.associations);
})();