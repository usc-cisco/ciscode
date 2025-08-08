"use client"

import AdminCard from "@/components/admin/admin-card";
import ProblemContainer from "@/components/shared/problem-container";
import ProtectedRoute from "@/components/shared/protected-route";
import { useAuth } from "@/contexts/auth.context";
import { fetchProblemCount } from "@/lib/fetchers/problem.fetchers";
import { fetchUserCount } from "@/lib/fetchers/user.fetchers";
import AdminCount from "@/lib/types/interface/admin-count.interface";
import { Code2, CodeIcon, User } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

enum AdminTableEnum {
    VERIFIED_PROBLEMS = "Verified Problems",
    ACTIVE_USERS = "Active Users",
    OFFERED_PROBLEMS = "Offered Problems",
}

export default function Admin() {
    const { token } = useAuth();

    const [currentAdminTable, setCurrentAdminTable] = useState<AdminTableEnum>(AdminTableEnum.VERIFIED_PROBLEMS);
    const [verifiedProblemCounts, setVerifiedProblemCounts] = useState<AdminCount>({
        count: 0,
        lastMonthCount: 0
    });
    const [userCounts, setUserCounts] = useState<AdminCount>({
        count: 0,
        lastMonthCount: 0
    });
    const [unverifiedProblemCounts, setUnverifiedProblemCounts] = useState<AdminCount>({
        count: 0,
        lastMonthCount: 0
    });

    const handleTableChange = (table: AdminTableEnum) => () => {
        if (currentAdminTable === table) return; // Prevent unnecessary state updates
        setCurrentAdminTable(table);
        redirect("/admin"); // Clear search params
    };

    useEffect(() => {
        if (!token) return;

        const getProblemData = async (verified: boolean) => {
            try {
                const response = await fetchProblemCount(token, verified);
                verified ? setVerifiedProblemCounts(response.data) : setUnverifiedProblemCounts(response.data);
            }
            catch (error) {
                console.error("Error fetching problem count:", error);
            }
        };

        const getUserData = async () => {
            try {
                const response = await fetchUserCount(token);
                setUserCounts(response.data);
            }
            catch (error) {
                console.error("Error fetching user count:", error);
            }
        }
        

        getProblemData(true);
        getUserData();
        getProblemData(false);
    }, [token])

    const renderTable = () => {
        switch (currentAdminTable) {
            case AdminTableEnum.VERIFIED_PROBLEMS:
                return <ProblemContainer key={"verified-problems"} inAdmin verified />;
            case AdminTableEnum.ACTIVE_USERS:
                return <></>;
            case AdminTableEnum.OFFERED_PROBLEMS:
                return <ProblemContainer key={"offered-problems"} inAdmin verified={false} />;
            default:
                return null;
        }
    }

    return (
        <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8">
            <h3 className="text-2xl font-bold">Admin Dashboard</h3>
            <p>Overview of key metrics and statistics</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-8">
                <AdminCard title="Verified Problems" value={verifiedProblemCounts.count} lastMonth={verifiedProblemCounts.lastMonthCount} Icon={Code2} handleView={handleTableChange(AdminTableEnum.VERIFIED_PROBLEMS)}/>
                <AdminCard title="Active Users" value={userCounts.count} lastMonth={userCounts.lastMonthCount} Icon={User} handleView={handleTableChange(AdminTableEnum.ACTIVE_USERS)}/>
                <AdminCard title="Offered Problems" value={unverifiedProblemCounts.count} lastMonth={unverifiedProblemCounts.lastMonthCount} Icon={CodeIcon} handleView={handleTableChange(AdminTableEnum.OFFERED_PROBLEMS)}/>
            </div>

            {renderTable()}
        </div>
        </section>
    )
}
