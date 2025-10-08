import { ActivityLog } from "./activity-log.model";
import { Problem } from "./problem.model";
import { Submission } from "./submission.model";
import { TestCaseSubmission } from "./testcase-submission.model";
import { TestCase } from "./testcase.model";
import { User } from "./user.model";

Problem.hasMany(TestCase, { foreignKey: "problemId", as: "testCases" });
Problem.hasMany(Submission, { foreignKey: "problemId", as: "submissions" });
Problem.belongsTo(User, { foreignKey: "authorId", as: "author" });

TestCase.belongsTo(Problem, { foreignKey: "problemId", as: "problem" });
TestCase.hasMany(TestCaseSubmission, {
  foreignKey: "testCaseId",
  as: "testCaseSubmissions",
});

User.hasMany(Problem, { foreignKey: "authorId", as: "problems" });
User.hasMany(Submission, { foreignKey: "userId", as: "submissions" });
User.hasMany(ActivityLog, { foreignKey: "userId", as: "activityLogs" });

Submission.belongsTo(User, { foreignKey: "userId", as: "user" });
Submission.belongsTo(Problem, { foreignKey: "problemId", as: "problem" });
Submission.hasMany(TestCaseSubmission, {
  foreignKey: "submissionId",
  as: "testCaseSubmissions",
});

TestCaseSubmission.belongsTo(Submission, {
  foreignKey: "submissionId",
  as: "submission",
});
TestCaseSubmission.belongsTo(TestCase, {
  foreignKey: "testCaseId",
  as: "testCase",
});

ActivityLog.belongsTo(User, { foreignKey: "userId", as: "user" });

export { Problem, Submission, TestCase, User, ActivityLog, TestCaseSubmission };
