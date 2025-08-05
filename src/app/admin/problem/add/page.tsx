"use client"

import AdminCodeEditor from '@/components/admin/problem/admin-code-editor'
import AdminProblemBar from '@/components/admin/problem/admin-problem-bar'
import AdminTestCaseBar from '@/components/admin/problem/admin-test-case-bar'
import SplitView from '@/components/shared/split-view'
import { useAuth } from '@/contexts/auth.context'
import { AddProblemSchemaType } from '@/dtos/problem.dto'
import { AddTestCaseSchemaType } from '@/dtos/testcase.dto'
import { addProblem } from '@/lib/fetchers/problem.fetchers'
import DifficultyEnum from '@/lib/types/enums/difficulty.enum'
import { redirect, useRouter } from 'next/navigation'
import React, { useState } from 'react'

const AddProblemPage = () => {
    const router = useRouter();
    const { token } = useAuth();
    const [problem, setProblem] = useState({
        title: "",
        description: "",
        difficulty: DifficultyEnum.PROG1,
        defaultCode: "// Write your boilerplate code here...",
        solutionCode: "// Write your solution code here...",
    });
    const [testCases, setTestCases] = useState<AddTestCaseSchemaType[]>([{
        input: "",
        hidden: false
    }]);
    const [isSolution, setIsSolution] = useState(true);

    const handleProblemChange = (field: string, value: string | DifficultyEnum) => {
        setProblem(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddTestCase = () => {
        setTestCases(prev => [...prev, {
            input: "",
            hidden: false
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
                defaultCode: problem.defaultCode == "// Write your boilerplate code here..." ? null : problem.defaultCode,            } as AddProblemSchemaType, token);
            router.push("/admin");
        } catch (error) {
            console.error("Error saving problem:", error);
        }
    }

    const handleCodeChange = (value: string | undefined) => {
        if (!value) return;

        isSolution
            ? handleProblemChange('solutionCode', value)
            : handleProblemChange('defaultCode', value);
    };

    const handleChangeIsSolution = (value: boolean) => () => {
        setIsSolution(value);
        if (value) {
            handleProblemChange('solutionCode', problem.solutionCode || "// Write your solution code here...");
        } else {
            handleProblemChange('defaultCode', problem.defaultCode || "// Write your boilerplate code here...");
        }
    };

    return (
        <div>
            <div>
            <SplitView
                sizes={[25, 50, 25]}
            >
                <AdminProblemBar problem={problem} onProblemChange={handleProblemChange} onSave={handleSaveProblem} />
                <AdminCodeEditor
                    defaultCode={problem.defaultCode}
                    solutionCode={problem.solutionCode}
                    onCodeChange={handleCodeChange}
                    isSolution={isSolution}
                    handleChangeIsSolution={handleChangeIsSolution}
                />
                <AdminTestCaseBar testCases={testCases} onAddTestCase={handleAddTestCase} onTestCaseChange={handleEditTestCase} onDeleteTestCase={handleDeleteTestCase} />
            </SplitView>
            </div>
        </div>
    )
}

export default AddProblemPage
