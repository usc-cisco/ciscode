import { Problem } from "@/models/problem.model";   
import { AddProblemSchemaType, ProblemSchemaResponse, ProblemSchemaResponseType } from "@/dtos/problem.dto";
import { id } from "zod/locales";
import { User } from "@/models/user.model";
import { UserResponseSchema } from "@/dtos/user.dto";
import UserService from "./user.service";

class ProblemService {
    static async getProblemById(id: number): Promise<ProblemSchemaResponseType | null> {
        const problem = await Problem.findByPk(id);
        if (!problem) {
            return null;
        }

        const response = ProblemSchemaResponse.parse(problem);
        const user = await UserService.getUserById(response.userId);
        if (user) {
            response.author = UserResponseSchema.parse(user).name;
        } else {
            response.author = "Unknown";
        }

        return response;
    }

    static async getProblems(page: number = 1, limit: number = 10) {
        const problems = await Problem.findAll({
            order: [["updatedAt", "DESC"]],
            offset: (page - 1) * limit,
            limit,
        });
        return problems;
    }

    static async addProblem(data: AddProblemSchemaType, userId: number): Promise<ProblemSchemaResponseType> {
        const user = await UserService.getUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const userParsedData = UserResponseSchema.parse(user);

        const newProblem = await Problem.create({
            ...data,
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