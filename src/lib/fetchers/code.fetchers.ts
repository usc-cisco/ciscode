import axios from "axios";
import instance from "../axios";

export const checkCode = async (code: string, input: string, token: string): Promise<{ output: string | null; error: string | null }> => {
    try {
        const response = await instance.post("/check", { code, input }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return {
            ...response.data,
            error: response.data.output.includes("[Execution timed out]") ? "Execution timed out" : null,
        };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.error) {
        return { output: null, error: error.response.data.error };
        }

        return { output: null, error: "Internal server error" };
    }
}
