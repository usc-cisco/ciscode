import axios from "axios";
import instance from "../axios";
import ApiResponse from "../types/interface/api-response.interface";
import { RunCodeResponseType } from "@/dtos/code.dto";

export const checkCode = async (code: string, input: string, token: string): Promise<RunCodeResponseType> => {
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
