import { User } from "@/models/user.model";
import { Problem } from "@/models/problem.model";
import { defineAssociations } from "@/models";

defineAssociations();

(async () => {
    await User.sync({ alter: true });
    await Problem.sync({ alter: true });
    console.log("Database synced.");

    console.log(Problem.associations);
})();