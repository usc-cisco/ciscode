import axios from "axios";
import instance from "../axios";
import ApiResponse from "../types/interface/api-response.interface";
import { CheckCodeResponseType, RunCodeResponseType } from "@/dtos/code.dto";
import { Sub } from "@radix-ui/react-dropdown-menu";
import SubmissionStatusEnum from "../types/enums/submissionstatus.enum";

export const runCode = async (code: string, input: string, token: string): Promise<RunCodeResponseType> => {
    try {
        const response = await instance.post<ApiResponse<RunCodeResponseType>>("/check", { code, input }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const { data: responseData } = response.data;

        return {
            ...responseData,
            error: (responseData.output && responseData.output.includes("[Execution timed out]")) ? "Execution timed out" : null,
        };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.data?.error) {
            return { output: null, error: error.response.data.data.error };
        }

        return { output: null, error: "Internal server error" };
    }
}

export const checkCode = async (code: string, testCaseId: number, token: string): Promise<CheckCodeResponseType> => {
    try {
        const response = await instance.post<ApiResponse<CheckCodeResponseType>>(`/check/${testCaseId}`, { code }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const { data: responseData } = response.data;

        return {
            ...responseData,
            error: (responseData.output && responseData.output.includes("[Execution timed out]")) ? "Execution timed out" : null,
        };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.data?.error) {
            return { output: null, error: error.response.data.data.error, status: SubmissionStatusEnum.FAILED };
        }

        return { output: null, error: "Internal server error", status: SubmissionStatusEnum.FAILED };
    }
}
