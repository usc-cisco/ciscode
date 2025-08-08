import { SubmissionResponseWithTestCaseSubmissionType } from "@/dtos/submission.dto";
import instance from "../axios";
import ApiResponse from "../types/interface/api-response.interface";

export const submitCode = async (code: string, problemId: number, token: string): Promise<SubmissionResponseWithTestCaseSubmissionType> => {
    try {
        const response = await instance.post<ApiResponse<SubmissionResponseWithTestCaseSubmissionType>>(`/submit/${problemId}`, { code }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data.data;
    } catch (error) {
        console.error("Error submitting code:", error);
        throw error;
    }
}