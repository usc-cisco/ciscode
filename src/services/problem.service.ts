import {
  AddProblemSchemaType,
  ProblemSchemaDisplayResponse,
  ProblemSchemaDisplayResponseType,
  ProblemSchemaResponse,
  ProblemSchemaResponseType,
  ProblemSchemaResponseWithTestCases,
  ProblemSchemaResponseWithTestCasesType,
} from "@/dtos/problem.dto";
import { UserResponseSchema, UserResponseSchemaType } from "@/dtos/user.dto";
import UserService from "./user.service";
import DifficultyEnum from "@/lib/types/enums/difficulty.enum";
import { Model, Op } from "sequelize";
import TestCaseService from "./testcase.service";
import { Problem } from "@/models/problem.model";
import SubmissionService from "./submission.service";

class ProblemService {
  static async getProblemById(
    id: number,
    withHidden: boolean = false,
  ): Promise<ProblemSchemaResponseWithTestCasesType | null> {
    const problem = await Problem.findByPk(id);
    if (!problem) {
      return null;
    }

    const response = ProblemSchemaResponseWithTestCases.parse(problem);

    const testCases = await TestCaseService.getTestCasesByProblemId(
      response.id,
      withHidden,
    );
    response.testCases = testCases;

    const user = await UserService.getUserById(response.authorId);
    if (user) {
      response.author = UserResponseSchema.parse(user).name;
    } else {
      response.author = "Unknown";
    }

    return response;
  }

  static async getProblems(
    verified: boolean = true,
    offset: number = 0,
    limit: number = 10,
    search: string = "",
    difficulty: DifficultyEnum | null = null,
    userId?: number,
  ): Promise<ProblemSchemaDisplayResponseType[]> {
    const problems = (await Problem.findAll({
      order: [["id", "ASC"]],
      offset: offset * limit,
      limit,
      where: {
        verified: verified,
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
        ...(difficulty && { difficulty }),
      },
    })) as (Model & ProblemSchemaResponseType)[];

    const parsedProblems = problems.map(async (problem) => {
      const author = (await UserService.getUserById(
        problem.authorId,
      )) as Model & UserResponseSchemaType;
      problem.author = author
        ? UserResponseSchema.parse(author).name
        : "Unknown";

      if (userId) {
        const existingSubmission =
          await SubmissionService.getSubmissionByProblemIdAndUserId(
            problem.id,
            userId,
          );
        problem.status = existingSubmission
          ? existingSubmission.status
          : undefined;
      }

      return ProblemSchemaDisplayResponse.parse(problem);
    });

    return Promise.all(parsedProblems);
  }

  static async getNextProblemId(problemId: number): Promise<number | null> {
    const nextProblem = (await Problem.findOne({
      where: {
        id: {
          [Op.gt]: problemId,
        },
        verified: true,
      },
      order: [["id", "ASC"]],
    })) as ProblemSchemaResponseType | null;

    return nextProblem ? nextProblem.id : null;
  }

  static async getTotalCount(
    verified: boolean = true,
    search: string = "",
    difficulty: DifficultyEnum | null = null,
  ): Promise<number> {
    const count = await Problem.count({
      where: {
        verified: verified,
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
        ...(difficulty && { difficulty }),
      },
    });

    return count;
  }

  static async getLastMonthCount(verified: boolean = true): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const count = await Problem.count({
      where: {
        verified: verified,
        createdAt: {
          [Op.gte]: startOfMonth,
        },
      },
    });

    return count;
  }

  static async addProblem(
    data: AddProblemSchemaType,
    userId: number,
  ): Promise<ProblemSchemaResponseType> {
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const userParsedData = UserResponseSchema.parse(user);

    const newProblem = await Problem.create({
      ...data,
      verified: true,
      authorId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = ProblemSchemaResponse.parse(newProblem);
    response.author = userParsedData.name;

    return response;
  }

  static async updateProblem(
    id: number,
    data: AddProblemSchemaType,
  ): Promise<ProblemSchemaResponseType> {
    const problem = await Problem.findByPk(id);
    if (!problem) {
      throw new Error("Problem not found");
    }

    const updatedProblem = await problem.update(data);
    return ProblemSchemaResponse.parse(updatedProblem);
  }

  static async deleteProblem(id: number): Promise<void> {
    const problem = await Problem.findByPk(id);
    if (!problem) {
      throw new Error("Problem not found");
    }

    await problem.destroy();
  }
}

export default ProblemService;
