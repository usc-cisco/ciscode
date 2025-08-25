import {
  SubmissionActivityType,
  SubmissionResponseType,
  UpdateSubmissionType,
} from "@/dtos/submission.dto";
import { Submission } from "@/models/submission.model";
import { Model } from "sequelize";
import ProblemService from "./problem.service";
import SubmissionStatusEnum from "@/lib/types/enums/problemstatus.enum";

class SubmissionService {
  static async getSubmissionById(
    id: number,
  ): Promise<SubmissionResponseType | null> {
    return (await Submission.findByPk(id)) as Model & SubmissionResponseType;
  }

  static async getSubmissionsByProblemId(
    problemId: number,
    limit: number = 10,
    offset: number = 0,
    status: SubmissionStatusEnum | null = null,
  ): Promise<SubmissionResponseType[]> {
    const submissions = (await Submission.findAll({
      order: [["updatedAt", "DESC"]],
      where: {
        problemId,
        ...(status && { status }),
      },
      limit,
      offset: offset * limit,
    })) as (Model & SubmissionResponseType)[];

    return submissions.map(
      (submission) =>
        ({
          id: submission.id,
          userId: submission.userId,
          problemId: submission.problemId,
          code: submission.code,
          status: submission.status,
          updatedAt: submission.updatedAt,
        }) as SubmissionResponseType,
    );
  }

  static async getSubmissionCountByProblemId(
    problemId: number,
    status: SubmissionStatusEnum | null = null,
  ): Promise<number> {
    const count = await Submission.count({
      where: {
        problemId,
        ...(status && { status }),
      },
    });
    return count;
  }

  static async getSubmissionByProblemIdAndUserId(
    problemId: number,
    userId: number,
  ): Promise<SubmissionResponseType | null> {
    return (await Submission.findOne({
      where: {
        problemId,
        userId,
      },
    })) as Model & SubmissionResponseType;
  }

  static async getRecentUserSubmissions(
    userId: number,
    limit: number = 10,
  ): Promise<SubmissionActivityType[]> {
    const submissions = (await Submission.findAll({
      where: { userId },
      order: [["updatedAt", "DESC"]],
      limit,
    })) as (Model & SubmissionResponseType & { updatedAt: Date })[];

    const submissionActivities = await Promise.all(
      submissions.map(async (submission) => {
        const problem = await ProblemService.getProblemById(
          submission.problemId,
        );

        if (!problem) {
          return undefined;
        }

        return {
          id: submission.id,
          userId: submission.userId,
          problemId: submission.problemId,
          status: submission.status,
          title: problem?.title || "Unknown",
          updatedAt: submission.updatedAt,
        };
      }),
    );

    return submissionActivities.filter(
      (submissionActivity): submissionActivity is SubmissionActivityType =>
        submissionActivity !== undefined,
    );
  }

  static async getSuccessPercentage(problemId: number): Promise<number> {
    const submissions = (await Submission.findAll({
      where: {
        problemId,
      },
    })) as (Model & SubmissionResponseType)[];

    const successfulSubmissions = submissions.filter(
      (submission) => submission.status === SubmissionStatusEnum.SOLVED,
    );

    return (successfulSubmissions.length / submissions.length) * 100 || 0;
  }

  static async addSubmission(
    problemId: number,
    userId: number,
    payload: UpdateSubmissionType,
  ): Promise<SubmissionResponseType> {
    const submission = (await Submission.create({
      problemId,
      userId,
      ...payload,
    })) as Model & SubmissionResponseType;

    return submission;
  }

  static async updateSubmission(
    id: number,
    payload: UpdateSubmissionType,
  ): Promise<SubmissionResponseType> {
    const submission = (await Submission.findByPk(id)) as Model &
      SubmissionResponseType;
    if (!submission) {
      throw new Error("Submission not found");
    }

    submission.code = payload.code || submission.code;
    submission.status = payload.status || submission.status;

    await submission.save();

    return submission;
  }

  static async saveSubmission(
    problemId: number,
    userId: number,
    payload: UpdateSubmissionType,
    updateStatus: boolean = true,
  ): Promise<SubmissionResponseType> {
    const existingSubmission = await this.getSubmissionByProblemIdAndUserId(
      problemId,
      userId,
    );
    if (existingSubmission) {
      return await this.updateSubmission(existingSubmission.id, {
        ...payload,
        status: updateStatus ? payload.status : existingSubmission.status,
      });
    }

    // Create a new submission if it doesn't exist
    return await this.addSubmission(problemId, userId, payload);
  }
}

export default SubmissionService;
