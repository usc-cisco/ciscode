import { CheckCodeResponseType } from "@/dtos/code.dto";
import { TestCaseSubmissionResponseType } from "@/dtos/testcase-submission.dto";
import { TestCaseSubmission } from "@/models";
import { Model } from "sequelize";

class TestCaseSubmissionService {
  static async getTestCaseSubmissionById(
    id: number,
  ): Promise<TestCaseSubmissionResponseType> {
    try {
      const testCaseSubmission = (await TestCaseSubmission.findByPk(
        id,
      )) as Model & TestCaseSubmissionResponseType;

      return testCaseSubmission;
    } catch (error) {
      console.error("Error fetching test case submission:", error);
      throw new Error("Failed to fetch test case submission");
    }
  }

  static async getTestCaseSubmissionsBySubmissionId(
    submissionId: number,
  ): Promise<TestCaseSubmissionResponseType[]> {
    try {
      const testCaseSubmissions = (await TestCaseSubmission.findAll({
        where: {
          submissionId,
        },
      })) as (Model & TestCaseSubmissionResponseType)[];

      return testCaseSubmissions;
    } catch (error) {
      console.error("Error fetching test case submissions:", error);
      throw new Error("Failed to fetch test case submissions");
    }
  }

  static async getTestCaseSubmissionByUserIdAndTestCaseId(
    submissionId: number,
    testCaseId: number,
  ): Promise<TestCaseSubmissionResponseType | null> {
    try {
      const submission = (await TestCaseSubmission.findOne({
        where: {
          submissionId,
          testCaseId,
        },
      })) as Model & TestCaseSubmissionResponseType;

      return submission;
    } catch (error) {
      console.error("Error fetching test case submission:", error);
      throw new Error("Failed to fetch test case submission");
    }
  }

  static async addTestCaseSubmission(
    testCaseId: number,
    submissionId: number,
    response: CheckCodeResponseType,
  ): Promise<TestCaseSubmissionResponseType> {
    const { output, error, status } = response;

    try {
      // Assuming you have a database model for TestCaseSubmission
      const submission = (await TestCaseSubmission.create({
        testCaseId,
        submissionId,
        output,
        error,
        status,
      })) as Model & TestCaseSubmissionResponseType;

      return submission;
    } catch (error) {
      console.error("Error creating test case submission:", error);
      throw new Error("Failed to create test case submission");
    }
  }

  static async updateTestCaseSubmission(
    id: number,
    response: CheckCodeResponseType,
  ) {
    try {
      const { output, error, status } = response;
      const submission = (await TestCaseSubmission.findByPk(id)) as Model &
        TestCaseSubmissionResponseType;
      if (!submission) {
        throw new Error("Test case submission not found");
      }

      submission.output = output;
      submission.error = error;
      submission.status = status;

      await submission.save();
      return submission;
    } catch (error) {
      console.error("Error updating test case submission:", error);
      throw new Error("Failed to update test case submission");
    }
  }

  static async saveTestCaseSubmission(
    testCaseId: number,
    submissionId: number,
    response: CheckCodeResponseType,
  ) {
    try {
      const existingSubmission =
        await this.getTestCaseSubmissionByUserIdAndTestCaseId(
          submissionId,
          testCaseId,
        );
      if (existingSubmission) {
        // Update existing submission
        return await this.updateTestCaseSubmission(
          existingSubmission.id,
          response,
        );
      }

      // Add a new submission if it doesn't exist
      return await TestCaseSubmissionService.addTestCaseSubmission(
        testCaseId,
        submissionId,
        response,
      );
    } catch (error) {
      console.error("Error saving test case submission:", error);
      throw new Error("Failed to save test case submission");
    }
  }
}

export default TestCaseSubmissionService;
