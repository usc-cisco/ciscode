import instance from "../axios";

export const fetchProblem = async (problemId: string) => {
    try {
        const token = localStorage.getItem("token");
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
