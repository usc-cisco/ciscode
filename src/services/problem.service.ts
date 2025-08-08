import { AddProblemSchemaType, ProblemSchemaDisplayResponse, ProblemSchemaDisplayResponseType, ProblemSchemaResponse, ProblemSchemaResponseType, ProblemSchemaResponseWithTestCases, ProblemSchemaResponseWithTestCasesType } from "@/dtos/problem.dto";
import { UserResponseSchema } from "@/dtos/user.dto";
import UserService from "./user.service";
import DifficultyEnum from "@/lib/types/enums/difficulty.enum";
import { Op } from "sequelize";
import TestCaseService from "./testcase.service";
import { Problem } from "@/models/problem.model";

class ProblemService {
    static async getProblemById(id: number): Promise<ProblemSchemaResponseWithTestCasesType | null> {
        const problem = await Problem.findByPk(id);
        if (!problem) {
            return null;
        }

        const response = ProblemSchemaResponseWithTestCases.parse(problem);

        const testCases = await TestCaseService.getTestCasesByProblemId(response.id);
        response.testCases = testCases;

        const user = await UserService.getUserById(response.authorId);
        if (user) {
            response.author = UserResponseSchema.parse(user).name;
        } else {
            response.author = "Unknown";
        }

        return response;
    }

    static async getProblems(verified: boolean = true, offset: number = 0, limit: number = 10, search: string = "", difficulty: DifficultyEnum | null = null): Promise<ProblemSchemaDisplayResponseType[]> {
        const problems = await Problem.findAll({
            order: [["id", "ASC"]],
            offset: (offset) * limit,
            limit,
            where: {
                verified: verified,
                [Op.or]: [
                    {
                        title: {
                        [Op.like]: `%${search}%`
                        }
                    }
                ],
                ...(difficulty && { difficulty })
            },
        });

        const parsedProblems = problems.map(async (problem) => {
            const parsedProblem = ProblemSchemaResponse.parse(problem);

            const user = await UserService.getUserById(parsedProblem.authorId);
            parsedProblem.author = user ? UserResponseSchema.parse(user).name : "Unknown";

            return ProblemSchemaDisplayResponse.parse(parsedProblem);
        });

        return Promise.all(parsedProblems);
    }

    static async getTotalCount(verified: boolean = true, search: string = "", difficulty: DifficultyEnum | null = null): Promise<number> {
        const count = await Problem.count({
            where: {
                verified: verified,
                [Op.or]: [
                    {
                        title: {
                            [Op.like]: `%${search}%`
                        }
                    }
                ],
                ...(difficulty && { difficulty })
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
                    [Op.gte]: startOfMonth
                }
            }
        });

        return count;
    }

    static async addProblem(data: AddProblemSchemaType, userId: number): Promise<ProblemSchemaResponseType> {
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
}

export default ProblemService;