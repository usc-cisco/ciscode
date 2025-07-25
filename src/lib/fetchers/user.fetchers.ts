import { LoginRequestSchemaType, RegisterRequestSchemaType } from "@/dtos/user.dto";
import instance from "../axios";

export const loginUser = async (data: LoginRequestSchemaType) => {
    try {
        const response = await instance.post("/auth/login", data);

        localStorage.setItem("token", response.data.token);
        instance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        return response.data;
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