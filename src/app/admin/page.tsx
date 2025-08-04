"use client"

import AdminCard from "@/components/admin/admin-card";
import ProblemContainer from "@/components/shared/problem-container";
import ProtectedRoute from "@/components/shared/protected-route";
import { Code2, CodeIcon, User } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";

enum AdminTableEnum {
    VERIFIED_PROBLEMS = "Verified Problems",
    ACTIVE_USERS = "Active Users",
    OFFERED_PROBLEMS = "Offered Problems",
}

export default function Admin() {
    const [currentAdminTable, setCurrentAdminTable] = useState<AdminTableEnum>(AdminTableEnum.VERIFIED_PROBLEMS);

    const handleTableChange = (table: AdminTableEnum) => () => {
        if (currentAdminTable === table) return; // Prevent unnecessary state updates
        
        setCurrentAdminTable(table);
        redirect("/admin");
    };

    return (
        <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8">
            <h3 className="text-2xl font-bold">Admin Dashboard</h3>
            <p>Overview of key metrics and statistics</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-8">
                <AdminCard title="Verified Problems" value={1} lastMonth={1} Icon={Code2} handleView={handleTableChange(AdminTableEnum.VERIFIED_PROBLEMS)}/>
                <AdminCard title="Active Users" value={1} lastMonth={0} Icon={User} handleView={handleTableChange(AdminTableEnum.ACTIVE_USERS)}/>
                <AdminCard title="Offered Problems" value={1} lastMonth={0} Icon={CodeIcon} handleView={handleTableChange(AdminTableEnum.OFFERED_PROBLEMS)}/>
            </div>

            {currentAdminTable === AdminTableEnum.VERIFIED_PROBLEMS && (
                <div>
                    <h3 className="text-xl font-bold pb-4">Verified Problems</h3>
                    <ProblemContainer inAdmin/>
                </div>
            )}
        </div>
        </section>
    )
}
