import { User } from "@/models/user.model";
import { Problem } from "@/models/problem.model";

(async () => {
    await User.sync({ alter: true });
    await Problem.sync({ alter: true });
    console.log("Database synced.");
})();