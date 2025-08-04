"use client"

import AdminProblemBar from '@/components/admin/problem/admin-problem-bar'
import AdminTestCaseBar from '@/components/admin/problem/admin-test-case-bar'
import CodeEditor from '@/components/problem/code-editor'
import ProblemBar from '@/components/problem/problem-bar'
import SplitView from '@/components/shared/split-view'
import { useAuth } from '@/contexts/auth.context'
import { AddProblemSchemaType } from '@/dtos/problem.dto'
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
        defaultCode: ""
    });

    const handleProblemChange = (field: string, value: string | DifficultyEnum) => {
        setProblem(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveProblem = async () => {
        if (!token) {
            console.error("User is not authenticated");
            return;
        }

        try {
            await addProblem(problem as AddProblemSchemaType, token);
            router.push("/admin");
        } catch (error) {
            console.error("Error saving problem:", error);
        }
    }

    const handleCodeChange = (value: string | undefined) => {
        handleProblemChange('defaultCode', value || "");
        console.log(problem.defaultCode)
    };

    return (
        <div>
            <div>
            <SplitView
                sizes={[25, 50, 25]}
            >
                <AdminProblemBar problem={problem} onProblemChange={handleProblemChange} onSave={handleSaveProblem} />
                <CodeEditor
                    onCodeChange={handleCodeChange}
                />
                <AdminTestCaseBar onSubmit={() => {}} />
            </SplitView>
            </div>
        </div>
    )
}

export default AddProblemPage
