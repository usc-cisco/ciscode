import { LoginRequestSchemaType, LoginResponseSchemaType, RegisterRequestSchemaType } from "@/dtos/user.dto";
import instance from "../axios";
import ApiResponse from "../types/interface/api-response.interface";
import AdminCount from "../types/interface/admin-count.interface";

export const loginUser = async (payload: LoginRequestSchemaType) => {
    try {
        const response = await instance.post<ApiResponse<LoginResponseSchemaType>>("/auth/login", payload);

        const { data } = response.data;

        return data;
    } catch (error: any) {
        console.error("Error logging in user:", error);
        throw new Error(error.response?.data?.error || "Failed to login user");
    }
}

export const registerUser = async (data: RegisterRequestSchemaType) => {
    try {
        const response = await instance.post("/auth/signup", data);
        return response.data;
    } catch (error: any) {
        console.error("Error registering user:", error);
        throw new Error(error.response?.data?.error || "Failed to register user");
    }
}

export const fetchUserCount = async (token: string): Promise<ApiResponse<AdminCount>> => {
    try {
        if (token) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await instance.get("/user/count");

        return response.data;
    } catch (error: any) {
        console.error("Error fetching user count:", error);
        throw new Error(error.response?.data?.error || "Failed to fetch user count");
    }
}