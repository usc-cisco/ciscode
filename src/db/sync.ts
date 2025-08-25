import { User } from "@/models/user.model";
import { Problem } from "@/models/problem.model";
import { TestCase } from "@/models/testcase.model";
import { Submission } from "@/models/submission.model";
import { TestCaseSubmission } from "@/models/testcase-submission.model";
import { ActivityLog } from "@/models/activity-log.model";

(async () => {
  await User.sync({ alter: true });
  await Problem.sync({ alter: true });
  await TestCase.sync({ alter: true });
  await Submission.sync({ alter: true });
  await TestCaseSubmission.sync({ alter: true });
  await ActivityLog.sync({ alter: true });
  console.log("Database synced.");

  console.log(Problem.associations);
})();
