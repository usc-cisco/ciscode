"use client";

import DropDownSelect from '@/components/home/drop-down-select';
import ProblemTable from '@/components/shared/problem-table';
import SearchBar from '@/components/home/search-bar';
import CustomPagination from '@/components/shared/custom-pagination';
import { useAuth } from '@/contexts/auth.context';
import { ProblemSchemaDisplayResponseType } from '@/dtos/problem.dto';
import env from '@/lib/env';
import { fetchProblems } from '@/lib/fetchers/problem.fetchers';
import DifficultyEnum from '@/lib/types/enums/difficulty.enum';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FormEventHandler, useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button';
import RoleEnum, { getRoleColor } from '@/lib/types/enums/role.enum';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { UserResponseSchemaType } from '@/dtos/user.dto';
import { fetchUsers } from '@/lib/fetchers/user.fetchers';

const UserContainer = () => {
    const { token } = useAuth();
    const router = useRouter()
    const params = useSearchParams();

    const [loading, setLoading] = useState<boolean>(true);    
    const [page, setPage] = useState<number>(Number(params.get("page")) || 1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [rolesFilter, setRolesFilter] = useState<string>(params.get("roles") || "all");
    const [filter, setFilter] = useState<string>(params.get("filter") || "");
    const [displayFilter, setDisplayFilter] = useState<string>(params.get("filter") || "");
    const [users, setUsers] = useState<UserResponseSchemaType[]>([]);

    const createQueryString = useCallback(
        (data: {name: string, value: string}[]) => {
            const newParams = new URLSearchParams(params.toString())
            data.forEach(({name, value}) => {
                newParams.set(name, value)
            })
            
            return newParams.toString()
        },
        [params]
    )
    
    useEffect(() => {
        if (!token) return;
        
        setLoading(true);

        // Fetch users based on filters
        const getUsers = async () => {
            try {
                const response = await fetchUsers(
                    token ?? "", 
                    page,
                    env.PROBLEM_LIMIT_PER_PAGE, 
                    filter, 
                    rolesFilter !== "all" ? rolesFilter : null,
                );
                setUsers(response.data.users || []);
                setTotalPages(response.data.totalPages || 1);

                if (response.data.users.length === 0) {
                    setPage(1);
                    setTotalPages(1);
                    router.push("/admin?" + createQueryString([{name: "page", value: "1"}]));
                }
            } catch (error) {
                console.error("Error fetching problems:", error);
            }
            finally{
                setLoading(false);
            }
        };

        getUsers();
    }, [token, page, rolesFilter, filter]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        setPage(1); // Reset to first page on filter change
        setFilter(displayFilter);
    };

    const handleValueChange = (value: string) => {
        router.push("/admin?" + createQueryString([{name: "page", value: "1"}, {name: "roles", value}]));
        setPage(1);
        setRolesFilter(value);
    };

    const handlePageChange = (newPage: number) => {
        return () => {
            setPage(newPage);
        }
    }

    const handleRowClick = (userId: number) => {
        router.push(`/admin/user/${userId}`);
    }

    return (
        <>
            <form className="flex flex-col sm:flex-row gap-4 mb-6" onSubmit={handleSubmit}>
                <SearchBar searchTerm={displayFilter} handleChange={setDisplayFilter} placeholder='Search problems...' />
                <DropDownSelect
                    value={rolesFilter}
                    handleValueChange={handleValueChange}
                    placeholder="Roles"
                    pairs={[
                        { value: 'all', label: 'All Roles' },
                        { value: RoleEnum.SUPER_ADMIN, label: 'Super Admin' },
                        { value: RoleEnum.ADMIN, label: 'Admin' },
                        { value: RoleEnum.USER, label: 'Student' },
                    ]}
                />
                <Button type='button' className="cursor-pointer w-32" onClick={() => router.push("/admin/user/add")}>
                    Add User
                </Button>
            </form>
            
            {/* Problems Table */}
            <div className="bg-vscode-light dark:bg-vscode-dark rounded-lg shadow overflow-hidden">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            loading
                            ||
                            users.map((user, index) => (
                                <TableRow key={index} onClick={() => handleRowClick(user.id)} className="cursor-pointer odd:bg-neutral-100 odd:dark:bg-neutral-800">
                                    <TableCell className="font-medium">{user.id}</TableCell>
                                    <TableCell className='truncate table-fixed flex-1'>
                                        <div className="font-medium">{user.username}</div>
                                    </TableCell>
                                    <TableCell className='truncate table-fixed'>
                                        <Badge variant="outline">{user.name}</Badge>
                                    </TableCell>
                                    <TableCell className='truncate table-fixed'>
                                        <Badge className={getRoleColor(user.role)}>{user.role === RoleEnum.USER ? "STUDENT": user.role}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
            {loading ? 
            <p className="text-center text-gray-500 py-8">
                Loading...
            </p>
            :
            users.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                    No users found matching your criteria.
                </p>
            )}
            {
                totalPages > 1 &&
                <div className='mt-8'>
                    <CustomPagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} createQueryString={createQueryString} path={"/admin"}/>
                </div>
            }
        </>
    )
}

export default UserContainer
