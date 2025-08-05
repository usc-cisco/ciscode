import instance from "../axios";

export const checkCode = async (code: string, input: string, token: string): Promise<{ output: string | null; error: string | null }> => {
    try {
        const response = await instance.post("/check", { code, input }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error checking code:", error);
        return { output: null, error: "Internal server error" };
    }
}
