import instance from "../axios";

export const fetchProblem = async (problemId: string) => {
    try {
        const response = await instance.get(`/problems/${problemId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching problem:", error);
        throw new Error("Failed to fetch problem");
    }
};
