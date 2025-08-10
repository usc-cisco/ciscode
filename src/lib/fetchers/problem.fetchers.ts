import { AddProblemSchemaType, ProblemSchemaResponseWithTestCasesType } from "@/dtos/problem.dto";
import instance from "../axios";
import ApiResponse from "../types/interface/api-response.interface";
import AdminCount from "../types/interface/admin-count.interface";

export const fetchProblem = async (problemId: string, token: string) => {
    try {
        if (token) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await instance.get<ApiResponse<ProblemSchemaResponseWithTestCasesType>>(`/problem/${problemId}`);

        return response.data;
    } catch (error: any) {
        console.error("Error fetching problem:", error);
        throw new Error(error.response?.data?.error || "Failed to fetch problem");
    }
};

export const fetchProblemWithSolution = async (problemId: string, token: string) => {
    try {
        if (token) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await instance.get<ApiResponse<ProblemSchemaResponseWithTestCasesType>>(`/problem/${problemId}/solution`);

        return response.data;
    } catch (error: any) {
        console.error("Error fetching problem:", error);
        throw new Error(error.response?.data?.error || "Failed to fetch problem");
    }
};

export const fetchProblems = async (token: string, page: number = 1, limit: number = 10, search: string = "", difficulty: string | null = null, verified: boolean = true) => {
    try {

        const params: any = { offset: page - 1, limit, search, verified };
        if (difficulty) {
            params.difficulty = difficulty;
        }

        if (token) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await instance.get("/problem", { params });

        return response.data;
    } catch (error: any) {
        console.error("Error fetching problems:", error);
        throw new Error(error.response?.data?.error || "Failed to fetch problems");
    }
};

export const fetchProblemCount = async (token: string, verified: boolean = true): Promise<ApiResponse<AdminCount>> => {
    try {
        if (token) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await instance.get(`/problem/count?verified=${verified}`);

        return response.data;
    } catch (error: any) {
        console.error("Error fetching problem count:", error);
        throw new Error(error.response?.data?.error || "Failed to fetch problem count");
    }
}

export const addProblem = async (data: AddProblemSchemaType, token: string) => {
    try {
        if (token) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await instance.post("/problem", data);

        return response.data;
    } catch (error: any) {
        console.error("Error adding problem:", error);
        throw new Error(error.response?.data?.error || "Failed to add problem");
    }
};

export const updateProblem = async (problemId: string, data: AddProblemSchemaType, token: string) => {
    try {
        if (token) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await instance.put(`/problem/${problemId}`, data);

        return response.data;
    } catch (error: any) {
        console.error("Error updating problem:", error);
        throw new Error(error.response?.data?.error || "Failed to update problem");
    }
};
