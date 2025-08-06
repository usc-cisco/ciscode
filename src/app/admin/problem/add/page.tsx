"use client"

import AdminCodeEditor from '@/components/admin/problem/admin-code-editor'
import AdminProblemBar from '@/components/admin/problem/admin-problem-bar'
import AdminTestCaseBar from '@/components/admin/problem/admin-test-case-bar'
import SplitView from '@/components/shared/split-view'
import { useAuth } from '@/contexts/auth.context'
import { RunCodeResponseType } from '@/dtos/code.dto'
import { AddProblemSchemaType } from '@/dtos/problem.dto'
import { AddTestCaseSchemaType } from '@/dtos/testcase.dto'
import { checkCode } from '@/lib/fetchers/code.fetchers'
import { addProblem } from '@/lib/fetchers/problem.fetchers'
import DifficultyEnum from '@/lib/types/enums/difficulty.enum'
import SubmissionStatusEnum from '@/lib/types/enums/submissionstatus.enum'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const AddProblemPage = () => {
    const router = useRouter();
    const { token } = useAuth();

    const [isSolution, setIsSolution] = useState(true);
    const [checked, setChecked] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);

    const [problem, setProblem] = useState({
        title: "",
        description: "",
        difficulty: DifficultyEnum.PROG1,
        defaultCode: "// Write your boilerplate code here...",
        solutionCode: "// Write your solution code here...",
    });

    const [testCases, setTestCases] = useState<AddTestCaseSchemaType[]>([{
        input: "",
        hidden: false,
        status: SubmissionStatusEnum.PENDING
    }]);

    const setAllToPending = () => {
        setTestCases(prev => prev.map(testCase => ({
            ...testCase,
            status: SubmissionStatusEnum.PENDING
        })));
    }

    const handleProblemChange = (field: string, value: string | DifficultyEnum) => {
        setProblem(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddTestCase = () => {
        setTestCases(prev => [...prev, {
            input: "",
            hidden: false,
            status: SubmissionStatusEnum.PENDING
        }]);
    };

    const handleEditTestCase = (index: number) => (field: string, value: string | boolean) => {
        setTestCases(prev => {
            const updatedTestCases = [...prev];
            updatedTestCases[index] = {
                ...updatedTestCases[index],
                [field]: value
            };
            return updatedTestCases;
        });
    };

    const handleDeleteTestCase = (index: number) => () => {
        setTestCases(prev => prev.filter((_, i) => i !== index));
    };

    const handleSaveProblem = async () => {
        if (!token) {
            console.error("User is not authenticated");
            return;
        }

        try {
            await addProblem({
                ...problem,
                defaultCode: problem.defaultCode == "// Write your boilerplate code here..." ? "" : problem.defaultCode,
                solutionCode: problem.solutionCode == "// Write your solution code here..." ? "" : problem.solutionCode,
                testCases: testCases
            } as AddProblemSchemaType, token);
            router.push("/admin");
        } catch (error) {
            console.error("Error saving problem:", error);
        }
    }

    const handleCodeChange = (value: string | undefined) => {
        if (checked) {
            setChecked(false);
            setAllToPending();
        }

        isSolution
            ? handleProblemChange('solutionCode', value ?? "")
            : handleProblemChange('defaultCode', value ?? "");
    };

    const handleChangeIsSolution = (value: boolean) => () => {
        setIsSolution(value);
        if (value) {
            handleProblemChange('solutionCode', problem.solutionCode || "// Write your solution code here...");
        } else {
            handleProblemChange('defaultCode', problem.defaultCode || "// Write your boilerplate code here...");
        }
    };

    const handleCheckCode = async (testCase: AddTestCaseSchemaType): Promise<RunCodeResponseType> => {
        if (!token) {
            console.error("User is not authenticated");
            return { output: null, error: "User is not authenticated" };
        }

        setChecked(true);

        try {
            const response = await checkCode(problem.solutionCode, testCase.input ?? "", token);
            return response;
        } catch (error) {
            console.error("Error checking code:", error);
            return { output: null, error: "Error checking code" };
        }
    };

    useEffect(() => {
        if (testCases.length > 0) {
            setCanSubmit(testCases.every(testCase => testCase.status === SubmissionStatusEnum.COMPLETED));
        } else {
            setCanSubmit(false);
        }
    }, [testCases])

    return (
        <div>
            <div>
            <SplitView
                sizes={[25, 50, 25]}
            >
                <AdminProblemBar problem={problem} onProblemChange={handleProblemChange} onSave={handleSaveProblem} canSubmit={canSubmit} />
                <AdminCodeEditor
                    defaultCode={problem.defaultCode}
                    solutionCode={problem.solutionCode}
                    onCodeChange={handleCodeChange}
                    isSolution={isSolution}
                    handleChangeIsSolution={handleChangeIsSolution}
                />
                <AdminTestCaseBar testCases={testCases} onAddTestCase={handleAddTestCase} onTestCaseChange={handleEditTestCase} onDeleteTestCase={handleDeleteTestCase} handleCheckCode
                ={handleCheckCode}/>
            </SplitView>
            </div>
        </div>
    )
}

export default AddProblemPage
