"use client";

import ProtectedRoute from '@/components/shared/protected-route'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth.context';
import { SubmissionActivityType } from '@/dtos/submission.dto';
import { fetchUserInfo, updatePassword } from '@/lib/fetchers/user.fetchers';
import { toastr } from '@/lib/toastr';
import SubmissionStatusEnum from '@/lib/types/enums/problemstatus.enum';
import RoleEnum, { getRoleColor } from '@/lib/types/enums/role.enum';
import { cn } from '@/lib/utils';
import { Check, Info, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

const Profile = () => {
    const { token, userInfo } = useAuth();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<{ currentPassword: string, newPassword: string, confirmPassword: string }>();

    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState<SubmissionActivityType[]>([]);
    const [open, setOpen] = useState(false);

    const handleChangePassword = async (data: { currentPassword: string, newPassword: string, confirmPassword: string }) => {
        try {
            await updatePassword(token as string, userInfo.id, data);
            toastr.success("Password updated successfully");
            setOpen(false);
            reset();
        } catch (error) {
            toastr.error("Error updating password");
            console.error("Error changing password:", error);
        }
    }

    useEffect(() => {
        if (!token) return;

        async function getUserInfo() {
            try {
                const response = await fetchUserInfo(token as string, userInfo.id);
                if (response.data) {
                    setSubmissions(response.data.submissionActivities || []);
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
            finally {
                setLoading(false);
            }
        }

        getUserInfo();
    }, [token, userInfo.id]);

  return (
    <ProtectedRoute>
        <section className='min-h-cscreen flex flex-col'>
            <div className='flex flex-col md:flex-row py-2 px-6 gap-2 h-full flex-1'>
                <Card className='w-full md:max-w-64 flex flex-col justify-between'>
                    <div className='flex flex-col gap-4'>
                        <div className='px-4 flex justify-center w-full'>
                            <div className='rounded-full bg-primary flex items-center justify-center aspect-square w-full max-w-44 p-8'>
                                <Image
                                    src='/cisco-logo-white.png'
                                    alt='Profile Picture'
                                    width={100}
                                    height={100}
                                    className='rounded-full w-full'
                                />
                            </div>
                        </div>
                        <div className='w-full px-4 text-sm flex flex-col gap-1'>
                            <div className='flex justify-between text-neutral-600 dark:text-neutral-400'>
                                <p>Username: </p>
                                <p>{userInfo.username}</p>
                            </div>
                            <div className='flex justify-between text-neutral-600 dark:text-neutral-400'>
                                <p>Name: </p>
                                <p>{userInfo.name}</p>
                            </div>
                            <div className='flex justify-between text-neutral-600 dark:text-neutral-400'>
                                <p>Role: </p>
                                <Badge className={cn("text-xs rounded-full", getRoleColor(userInfo.role))}>{userInfo.role === RoleEnum.USER ? 'STUDENT' : userInfo.role}</Badge>
                            </div>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button type='button' className='w-full mt-4 cursor-pointer'>
                                        Change Password
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className='bg-vscode-light dark:bg-vscode-dark'>
                                    <form onSubmit={handleSubmit(handleChangePassword)}>
                                        <DialogTitle>Change Password</DialogTitle>
                                        <div className='my-4 flex flex-col gap-2'>
                                            <Input type="password" placeholder="Current Password" className="py-5" {...register("currentPassword", { required: "Current Password is required" })} />
                                            <p className='text-red-500 text-xs'>{errors.currentPassword?.message}</p>
                                            <Input type="password" placeholder="New Password" className="py-5" {...register("newPassword", { required: "New Password is required" })} />
                                            <p className='text-red-500 text-xs'>{errors.newPassword?.message}</p>
                                            <Input type="password" placeholder="Confirm Password" className="py-5" {...register("confirmPassword", { required: "Confirm Password is required" })} />
                                            <p className='text-red-500 text-xs'>{errors.confirmPassword?.message}</p>
                                            <div className='text-gray-400 dark:text-gray-600 flex  gap-1 items-start justify-center mt-2 px-2'>
                                                <Info className='size-3 mt-[0.125rem]'/>
                                                <p className='text-xs'>Important: For your safety, avoid using your usual secure passwords. Pick something unique just for this app.</p>
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <Button type="submit" className='w-full cursor-pointer'>Save Changes</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div className='text-gray-400 dark:text-gray-600 flex gap-1 items-center justify-center mt-2 px-2'>
                        <Info className='size-3'/>
                        <p className='text-xs'>Incorrect details? Contact CISCO.</p>
                    </div>
                </Card>
                <Card className='w-full p-6 autoflow-y-auto'>
                    <CardTitle className='text-lg font-semibold'>Recent Submissions</CardTitle>
                    <CardContent className='p-0'>
                        <div className='w-full flex flex-col gap-2'>
                            {loading ? (
                                <p className='text-gray-500 text-sm'>Loading...</p>
                            ) : 
                                submissions.length === 0 ? (
                                    <p className='text-gray-500 text-sm'>No submissions so far...</p>
                                ) : (
                                    submissions.map((submission) => {
                                        const Icon = submission.status === SubmissionStatusEnum.SOLVED ? <Check className='text-green-500 size-4'/> : <X className='text-red-500 size-4'/>;

                                    return (
                                        <div onClick={() => router.push(`/problem/${submission.problemId}`)} key={submission.id} className={`py-4 px-4 rounded-sm border flex justify-between items-center cursor-pointer transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900`}>
                                            <div className='flex items-center gap-2'>
                                                {Icon}
                                                <p>{submission.title}</p>
                                            </div>
                                            <p className='text-xs text-gray-500'>{new Date(submission.updatedAt).toDateString()}</p>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    </ProtectedRoute>
  )
}

export default Profile
