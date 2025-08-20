import axios from "axios";
import instance from "../axios";
import ApiResponse from "../types/interface/api-response.interface";
import { CheckCodeResponseType, RunCodeResponseType } from "@/dtos/code.dto";
import TestCaseSubmissionStatusEnum from "../types/enums/submissionstatus.enum";

export const runCode = async (
  code: string,
  input: string,
  token: string,
): Promise<RunCodeResponseType> => {
  try {
    const response = await instance.post<ApiResponse<RunCodeResponseType>>(
      "/run",
      { code, input },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { data: responseData } = response.data;

    return {
      ...responseData,
      error:
        responseData.output &&
        responseData.output.includes("[Execution timed out]")
          ? "Execution timed out"
          : responseData.error,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.data?.error) {
      return { output: null, error: error.response.data.data.error };
    }

    return { output: null, error: "Internal server error" };
  }
};

export const runTestCase = async (
  code: string,
  testCaseId: number,
  token: string,
): Promise<CheckCodeResponseType> => {
  try {
    const response = await instance.post<ApiResponse<CheckCodeResponseType>>(
      `/run/${testCaseId}`,
      { code },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { data: responseData } = response.data;

    return {
      ...responseData,
      error:
        responseData.output &&
        responseData.output.includes("[Execution timed out]")
          ? "Execution timed out"
          : responseData.error,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.data?.error) {
      return {
        output: null,
        error: error.response.data.data.error,
        status: TestCaseSubmissionStatusEnum.FAILED,
      };
    }

    return {
      output: null,
      error: "Internal server error",
      status: TestCaseSubmissionStatusEnum.FAILED,
    };
  }
};

export const runTestCaseAsAdmin = async (
  code: string,
  testCaseId: number,
  token: string,
): Promise<CheckCodeResponseType> => {
  try {
    const response = await instance.post<ApiResponse<CheckCodeResponseType>>(
      `/run/${testCaseId}/admin`,
      { code },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { data: responseData } = response.data;

    return {
      ...responseData,
      error:
        responseData.output &&
        responseData.output.includes("[Execution timed out]")
          ? "Execution timed out"
          : responseData.error,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.data?.error) {
      return {
        output: null,
        error: error.response.data.data.error,
        status: TestCaseSubmissionStatusEnum.FAILED,
      };
    }

    return {
      output: null,
      error: "Internal server error",
      status: TestCaseSubmissionStatusEnum.FAILED,
    };
  }
};
