import axios from "axios";
import instance from "../axios";

export const fetchLogs = async (
  token: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  actionType: string | null = null,
) => {
  try {
    const params: {
      offset: number;
      limit: number;
      search: string;
      actionType?: string | null;
    } = { offset: page - 1, limit, search };
    if (actionType) {
      params.actionType = actionType;
    }

    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const response = await instance.get("/activity", { params });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch activity logs",
      );
    }

    console.error("Error fetching activity logs:", error);
    throw error;
  }
};
