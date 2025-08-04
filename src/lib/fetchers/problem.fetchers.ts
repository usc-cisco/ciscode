import { AddProblemSchemaType } from "@/dtos/problem.dto";
import instance from "../axios";

export const fetchProblem = async (problemId: string, token: string) => {
    try {
        if (token) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await instance.get(`/problem/${problemId}`);

        return response.data;
    } catch (error: any) {
        console.error("Error fetching problem:", error);
        throw new Error(error.response?.data?.error || "Failed to fetch problem");
    }
};

export const fetchProblems = async (token: string, page: number = 1, limit: number = 10, search: string = "", difficulty: string | null = null) => {
    try {

        const params: any = { offset: page - 1, limit, search };
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
