import { ProblemSchemaResponseType } from "@/dtos/problem.dto";
import { AddTestCaseSchemaType, TestCaseResponse, TestCaseResponseType } from "@/dtos/testcase.dto";
import { runCCode } from "@/lib/code-runner";
import { TestCase } from "@/models/testcase.model";

class TestCaseService {
    static async addTestCase(testCase: AddTestCaseSchemaType): Promise<TestCaseResponseType>  {
        const newTestCase = await TestCase.create(testCase);

        const newTestCaseResponse: TestCaseResponseType = TestCaseResponse.parse(newTestCase);

        return newTestCaseResponse;
    }

    static async addTestCases(testCases: AddTestCaseSchemaType[], problem: ProblemSchemaResponseType): Promise<TestCaseResponseType[]> {
        try {
            const updatedTestCases = await Promise.all(testCases.map(async testCase => {
                const { output, error } = await runCCode(problem.solutionCode ?? "", testCase.input || "");

                if (error) {
                    throw new Error(error);
                }

                return {
                    ...testCase,
                    output: output || "",
                    problemId: problem.id
                };
            }));

            const newTestCases = await TestCase.bulkCreate(updatedTestCases);

            return newTestCases.map(testCase => TestCaseResponse.parse(testCase));
        } catch (error) {
            console.error("Error adding test cases:", error);
            throw new Error("Failed to add test cases");
        }
    }
    
    static async getTestCaseById(id: number): Promise<TestCaseResponseType | null> {
        const testCase = await TestCase.findByPk(id);
        if (!testCase) {
            return null;
        }

        return TestCaseResponse.parse(testCase);
    }

    static async getTestCasesByProblemId(problemId: number, withHidden: boolean = false): Promise<TestCaseResponseType[]> {
        const testCases = await TestCase.findAll({
            where: { problemId },
            order: [["id", "ASC"]]
        });

        return testCases.map(testCase => {
            const parsedTestCase = TestCaseResponse.parse(testCase);
            
            if (!withHidden && parsedTestCase.hidden) {
                delete parsedTestCase.input;
                delete parsedTestCase.output;
            }
            
            return parsedTestCase;
        });
    }

    static async updateTestCase(id: number, data: Partial<AddTestCaseSchemaType>): Promise<TestCaseResponseType> {
        const testCase = await TestCase.findByPk(id);
        if (!testCase) {
            throw new Error("Test case not found");
        }

        const updatedTestCase = await testCase.update(data);
        return TestCaseResponse.parse(updatedTestCase);
    }

    static async deleteTestCase(id: number): Promise<void> {
        const testCase = await TestCase.findByPk(id);
        if (!testCase) {
            throw new Error("Test case not found");
        }

        await testCase.destroy();
    }
}

export default TestCaseService;