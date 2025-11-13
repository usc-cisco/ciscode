"use client";

import Info from "@/components/shared/info";
import ProtectedRoute from "@/components/shared/protected-route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth.context";
import { SubmissionActivityType } from "@/dtos/submission.dto";
import {
  fetchUserInfo,
  fetchUserStatistics,
  updatePassword,
} from "@/lib/fetchers/user.fetchers";
import { toastr } from "@/lib/toastr";
import SubmissionStatusEnum from "@/lib/types/enums/problemstatus.enum";
import RoleEnum, { getRoleColor } from "@/lib/types/enums/role.enum";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UserStatisticsType } from "@/dtos/user-statistics.dto";
import SolvedCircle from "@/components/profile/solved-circle";
import DifficultyStats from "@/components/profile/difficulty-stats";
import SubmissionCalendar from "@/components/profile/submission-calendar";
import { getDifficultyColor } from "@/lib/types/enums/difficulty.enum";

const Profile = () => {
  const { token, userInfo } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<SubmissionActivityType[]>([]);
  const [statistics, setStatistics] = useState<UserStatisticsType | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const handleChangePassword = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      await updatePassword(token as string, userInfo.id, data);
      toastr.success("Password updated successfully");
      setOpen(false);
      reset();
    } catch (error) {
      toastr.error("Error updating password");
      console.error("Error changing password:", error);
    }
  };

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
      } finally {
        setLoading(false);
      }
    }

    async function getUserStatistics() {
      try {
        const response = await fetchUserStatistics(
          token as string,
          userInfo.id,
        );
        if (response.data) {
          setStatistics(response.data);
        }
      } catch (error) {
        console.error("Error fetching user statistics:", error);
      } finally {
        setStatisticsLoading(false);
      }
    }

    getUserInfo();
    getUserStatistics();
  }, [token, userInfo.id]);

  return (
    <ProtectedRoute>
      <section className="min-h-cscreen flex flex-col">
        <div className="flex flex-col md:flex-row py-2 px-6 gap-2 h-full flex-1">
          <Card className="w-full md:max-w-64 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="px-4 flex justify-center w-full">
                <div className="rounded-full bg-primary flex items-center justify-center aspect-square w-full max-w-44 p-8">
                  <Image
                    src="/cisco-logo-white.png"
                    alt="Profile Picture"
                    width={100}
                    height={100}
                    className="rounded-full w-full"
                  />
                </div>
              </div>
              <div className="w-full px-4 text-sm flex flex-col gap-1">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400 gap-2">
                  <p>Username: </p>
                  <p className="text-end">{userInfo.username}</p>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400 gap-2">
                  <p>Name: </p>
                  <p className="text-end">{userInfo.name}</p>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <p>Role: </p>
                  <Badge
                    className={cn(
                      "text-xs rounded-full",
                      getRoleColor(userInfo.role),
                    )}
                  >
                    {userInfo.role === RoleEnum.USER
                      ? "STUDENT"
                      : userInfo.role}
                  </Badge>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      className="w-full mt-4 cursor-pointer"
                    >
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-vscode-light dark:bg-vscode-dark">
                    <form onSubmit={handleSubmit(handleChangePassword)}>
                      <DialogTitle>Change Password</DialogTitle>
                      <div className="my-4 flex flex-col gap-2">
                        <Input
                          type="password"
                          placeholder="Current Password"
                          className="py-5"
                          {...register("currentPassword", {
                            required: "Current Password is required",
                          })}
                        />
                        <p className="text-red-500 text-xs">
                          {errors.currentPassword?.message}
                        </p>
                        <Input
                          type="password"
                          placeholder="New Password"
                          className="py-5"
                          {...register("newPassword", {
                            required: "New Password is required",
                          })}
                        />
                        <p className="text-red-500 text-xs">
                          {errors.newPassword?.message}
                        </p>
                        <Input
                          type="password"
                          placeholder="Confirm Password"
                          className="py-5"
                          {...register("confirmPassword", {
                            required: "Confirm Password is required",
                          })}
                        />
                        <p className="text-red-500 text-xs">
                          {errors.confirmPassword?.message}
                        </p>
                        <Info text="Important: For your safety, avoid using your usual secure passwords. Pick something unique just for this app." />
                      </div>

                      <DialogFooter>
                        <Button type="submit" className="w-full cursor-pointer">
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Info text="Incorrect details? Contact CISCO." />
          </Card>

          <div className="w-full flex flex-col gap-4">
            {statisticsLoading ? (
              <Card className="w-full p-6">
                <p className="text-gray-500 text-sm">Loading statistics...</p>
              </Card>
            ) : statistics ? (
              <>
                <Card className="w-full p-6 gap-0">
                  <CardTitle className="text-lg font-semibold mb-6">
                    Solved Problems
                  </CardTitle>
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <SolvedCircle
                        totalSolved={statistics.totalSolved}
                        totalProblems={statistics.totalProblems}
                      />
                      <div className="flex-1 w-full">
                        <DifficultyStats
                          solvedByDifficulty={statistics.solvedByDifficulty}
                          totalByDifficulty={statistics.totalByDifficulty}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submission Calendar */}
                <Card className="w-full p-6 gap-0">
                  <CardTitle className="text-lg font-semibold mb-4">
                    Submission Activity
                  </CardTitle>
                  <CardContent className="p-0">
                    <SubmissionCalendar
                      submissionCalendar={statistics.submissionCalendar}
                      totalSubmissions={statistics.totalSubmissions}
                      activeDays={statistics.activeDays}
                      maxStreak={statistics.maxStreak}
                    />
                  </CardContent>
                </Card>
              </>
            ) : null}

            {/* Recent Submissions */}
            <Card className="w-full p-6 autoflow-y-auto gap-4">
              <CardTitle className="text-lg font-semibold">
                Recent Submissions
              </CardTitle>
              <CardContent className="p-0">
                <div className="w-full flex flex-col gap-2">
                  {loading ? (
                    <p className="text-gray-500 text-sm">Loading...</p>
                  ) : submissions.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No submissions so far...
                    </p>
                  ) : (
                    submissions.map((submission) => {
                      const Icon =
                        submission.status === SubmissionStatusEnum.SOLVED ? (
                          <Check className="text-green-500 size-4" />
                        ) : (
                          <X className="text-red-500 size-4" />
                        );

                      return (
                        <div
                          onClick={() =>
                            router.push(`/problem/${submission.problemId}`)
                          }
                          key={submission.id}
                          className={`py-4 px-4 rounded-sm border flex justify-between gap-4 items-center cursor-pointer transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900`}
                        >
                          <div className="flex items-center gap-2 flex-1 w-0">
                            <div>{Icon}</div>
                            <p className="truncate">{submission.title}</p>
                            {submission.difficulty && (
                              <Badge
                                className={cn(
                                  "ml-2",
                                  getDifficultyColor(submission.difficulty),
                                )}
                              >
                                {submission.difficulty}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(submission.updatedAt).getMonth() +
                              1 +
                              "/" +
                              new Date(submission.updatedAt).getDate() +
                              "/" +
                              new Date(submission.updatedAt).getFullYear()}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default Profile;
