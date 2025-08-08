import { SubmissionResponseType, UpdateSubmissionType } from "@/dtos/submission.dto";
import { Submission } from "@/models/submission.model";
import { Model } from "sequelize";

class SubmissionService {
    static async getSubmissionById(id: number): Promise<SubmissionResponseType | null> {
        return await Submission.findByPk(id) as Model & SubmissionResponseType;
    }

    static async getSubmissionByProblemIdAndUserId(problemId: number, userId: number): Promise<SubmissionResponseType | null> {
        return await Submission.findOne({
            where: {
                problemId,
                userId
            }
        }) as Model & SubmissionResponseType;
    }

    static async addSubmission(problemId: number, userId: number, payload: UpdateSubmissionType): Promise<SubmissionResponseType> {
        const submission = await Submission.create({
            problemId,
            userId,
            ...payload
        }) as Model & SubmissionResponseType;

        return submission;
    }

    static async updateSubmission(id: number, payload: UpdateSubmissionType): Promise<SubmissionResponseType> {
        const submission = await Submission.findByPk(id) as Model & SubmissionResponseType;
        if (!submission) {
            throw new Error("Submission not found");
        }

        submission.code = payload.code || submission.code;
        submission.status = payload.status || submission.status;

        await submission.save();

        return submission;
    }

    static async saveSubmission(problemId: number, userId: number, payload: UpdateSubmissionType): Promise<SubmissionResponseType> {
        const existingSubmission = await this.getSubmissionByProblemIdAndUserId(problemId, userId);
        if (existingSubmission) {
            return await this.updateSubmission(existingSubmission.id, payload);
        }

        // Create a new submission if it doesn't exist
        return await this.addSubmission(problemId, userId, payload);
    }
}

export default SubmissionService;