import {
  SubmissionResponseWithTestCaseSubmissionAndUserType,
  SubmissionResponseWithTestCaseSubmissionType,
} from "@/dtos/submission.dto";
import instance from "../axios";
import ApiResponse from "../types/interface/api-response.interface";
import { ProblemSchemaResponseWithTestCasesType } from "@/dtos/problem.dto";

export const submitCode = async (
  code: string,
  problemId: number,
  token: string,
): Promise<
  SubmissionResponseWithTestCaseSubmissionType & { nextProblemId: number }
> => {
  try {
    const response = await instance.post<
      ApiResponse<
        SubmissionResponseWithTestCaseSubmissionType & { nextProblemId: number }
      >
    >(
      `/problem/${problemId}/submission`,
      { code },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.data;
  } catch (error) {
    console.error("Error submitting code:", error);
    throw error;
  }
};

export const fetchSubmissionsByProblemId = async (
  problemId: number,
  token: string,
  status: string | null,
  page: number = 1,
  limit: number = 10,
): Promise<{
  problem: ProblemSchemaResponseWithTestCasesType;
  submissions: SubmissionResponseWithTestCaseSubmissionAndUserType[];
  submissionCount: number;
  totalPages: number;
}> => {
  try {
    const response = await instance.get<
      ApiResponse<{
        problem: ProblemSchemaResponseWithTestCasesType;
        submissions: SubmissionResponseWithTestCaseSubmissionAndUserType[];
        submissionCount: number;
        totalPages: number;
      }>
    >(`/problem/${problemId}/submission`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        status,
        offset: page - 1,
        limit,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching submissions:", error);
    throw error;
  }
};
