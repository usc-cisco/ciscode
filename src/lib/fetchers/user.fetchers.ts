import {
  LoginRequestSchemaType,
  LoginResponseSchemaType,
  RegisterRequestSchemaType,
  UserResponseSchemaType,
} from "@/dtos/user.dto";
import instance from "../axios";
import ApiResponse from "../types/interface/api-response.interface";
import AdminCount from "../types/interface/admin-count.interface";
import axios from "axios";
import { SubmissionActivityType } from "@/dtos/submission.dto";

export const loginUser = async (payload: LoginRequestSchemaType) => {
  try {
    const response = await instance.post<ApiResponse<LoginResponseSchemaType>>(
      "/auth/login",
      payload,
    );

    const { data } = response.data;

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error logging in user:", error);
      throw new Error(error.response?.data?.error || "Failed to login user");
    }

    console.error("Error logging in user:", error);
    throw error;
  }
};

export const registerUser = async (data: RegisterRequestSchemaType) => {
  try {
    const response = await instance.post("/auth/signup", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to register user");
    }

    console.error("Error registering user:", error);
    throw error;
  }
};

export const fetchUsers = async (
  token: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  role: string | null = null,
  verified: boolean = true,
) => {
  try {
    const params: {
      offset: number;
      limit: number;
      search: string;
      verified: boolean;
      role?: string | null;
    } = { offset: page - 1, limit, search, verified };
    if (role) {
      params.role = role;
    }

    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.get("/user", { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch users");
    }

    console.error("Error fetching users:", error);
    throw error;
  }
};

export const addUserAsAdmin = async (
  data: RegisterRequestSchemaType,
  token: string,
) => {
  try {
    const response = await instance.post("/user", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to register user");
    }

    console.error("Error registering user:", error);
    throw error;
  }
};

export const fetchUserCount = async (
  token: string,
): Promise<ApiResponse<AdminCount>> => {
  try {
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.get("/user/count");

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch user count",
      );
    }

    console.error("Error fetching user count:", error);
    throw error;
  }
};

export const fetchUserInfo = async (token: string, userId: number) => {
  try {
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.get<
      ApiResponse<{
        user: UserResponseSchemaType;
        submissionActivities: SubmissionActivityType[];
      }>
    >(`/user/${userId}`);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch user info",
      );
    }

    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const updatePassword = async (
  token: string,
  userId: number,
  payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  },
) => {
  try {
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.patch(`/user/${userId}`, payload);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to update password",
      );
    }

    console.error("Error updating password:", error);
    throw error;
  }
};
