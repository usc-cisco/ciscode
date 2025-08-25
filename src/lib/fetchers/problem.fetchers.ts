import {
  AddProblemSchemaType,
  ProblemSchemaResponseWithTestCasesType,
} from "@/dtos/problem.dto";
import instance from "../axios";
import ApiResponse from "../types/interface/api-response.interface";
import AdminCount from "../types/interface/admin-count.interface";
import axios from "axios";

export const fetchProblem = async (problemId: string, token: string) => {
  try {
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.get<
      ApiResponse<ProblemSchemaResponseWithTestCasesType>
    >(`/problem/${problemId}`);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching problem:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch problem");
    }

    console.error("Error fetching problem:", error);
    throw error;
  }
};

export const fetchProblemWithSolution = async (
  problemId: string,
  token: string,
) => {
  try {
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.get<
      ApiResponse<ProblemSchemaResponseWithTestCasesType>
    >(`/problem/${problemId}/solution`);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching problem:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch problem");
    }

    console.error("Error fetching problem:", error);
    throw error;
  }
};

export const fetchProblems = async (
  token: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  difficulty: string | null = null,
  verified: boolean = true,
) => {
  try {
    const params: {
      offset: number;
      limit: number;
      search: string;
      verified: boolean;
      difficulty?: string | null;
    } = { offset: page - 1, limit, search, verified };
    if (difficulty) {
      params.difficulty = difficulty;
    }

    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.get("/problem", { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching problems:", error);
      throw new Error(
        error.response?.data?.error || "Failed to fetch problems",
      );
    }

    console.error("Error fetching problems:", error);
    throw error;
  }
};

export const fetchProblemCount = async (
  token: string,
  verified: boolean = true,
): Promise<ApiResponse<AdminCount>> => {
  try {
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.get(`/problem/count?verified=${verified}`);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching problem count:", error);
      throw new Error(
        error.response?.data?.error || "Failed to fetch problem count",
      );
    }

    console.error("Error fetching problem count:", error);
    throw error;
  }
};

export const addProblem = async (data: AddProblemSchemaType, token: string) => {
  try {
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.post("/problem", data);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error adding problem:", error);
      throw new Error(error.response?.data?.error || "Failed to add problem");
    }

    console.error("Error adding problem:", error);
    throw error;
  }
};

export const offerProblem = async (
  data: AddProblemSchemaType,
  token: string,
) => {
  try {
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.post("/problem/offer", data);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error adding problem:", error);
      throw new Error(error.response?.data?.error || "Failed to add problem");
    }

    console.error("Error adding problem:", error);
    throw error;
  }
};

export const updateProblem = async (
  problemId: string,
  data: AddProblemSchemaType,
  token: string,
) => {
  try {
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.put(`/problem/${problemId}`, data);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating problem:", error);
      throw new Error(
        error.response?.data?.error || "Failed to update problem",
      );
    }

    console.error("Error updating problem:", error);
    throw error;
  }
};

export const deleteProblem = async (problemId: string, token: string) => {
  try {
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.delete(`/problem/${problemId}`);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting problem:", error);
      throw new Error(
        error.response?.data?.error || "Failed to delete problem",
      );
    }

    console.error("Error deleting problem:", error);
    throw error;
  }
};
