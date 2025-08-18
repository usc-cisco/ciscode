"use client";

import Loading from "@/app/loading";
import DropDownSelect from "@/components/home/drop-down-select";
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
import { UpdateUserSchemaType, UserResponseSchemaType } from "@/dtos/user.dto";
import {
  fetchUserInfo,
  updatePasswordAsAdmin,
  updateUser,
} from "@/lib/fetchers/user.fetchers";
import { toastr } from "@/lib/toastr";
import SubmissionStatusEnum from "@/lib/types/enums/problemstatus.enum";
import RoleEnum, { getRoleColor } from "@/lib/types/enums/role.enum";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Profile = () => {
  const { token, isSuperAdmin, userInfo: adminInfo } = useAuth();
  const router = useRouter();
  const passwordForm = useForm<{
    newPassword: string;
    confirmPassword: string;
  }>();
  const detailsForm = useForm<UpdateUserSchemaType>();
  const params = useParams();
  if (!params.id) {
    router.push("/admin");
  }

  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<SubmissionActivityType[]>([]);
  const [openPassword, setOpenPassword] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [userInfo, setUserInfo] = useState<UserResponseSchemaType | null>(null);
  const [updateUserRole, setUpdateUserRole] = useState<RoleEnum>(RoleEnum.USER);
  const [dropdownPair, setDropdownPair] = useState<
    { value: RoleEnum; label: string }[]
  >([]);

  const handleChangePassword = async (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      if (!userInfo) return;

      await updatePasswordAsAdmin(token as string, userInfo.id, data);
      toastr.success("Password updated successfully");
      setOpenPassword(false);
      passwordForm.reset();
    } catch (error) {
      toastr.error("Error updating password");
      console.error("Error changing password:", error);
    }
  };

  const handleUpdateUser = async (data: UpdateUserSchemaType) => {
    try {
      if (!userInfo) return;

      const response = await updateUser(token as string, userInfo.id, {
        ...data,
        role: updateUserRole,
      });
      setUserInfo(response.data);
      console.log("User updated:", response.data);
      setOpenDetails(false);
      detailsForm.reset();
      toastr.success("User updated successfully");
    } catch (error) {
      toastr.error("Error updating user");
      console.error("Error updating user:", error);
    }
  };

  useEffect(() => {
    if (!token) return;

    async function getUserInfo() {
      try {
        const response = await fetchUserInfo(
          token as string,
          Number(params.id),
        );
        if (response.data) {
          setSubmissions(response.data.submissionActivities || []);
          setUserInfo(response.data.user);
          setUpdateUserRole(response.data.user.role);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    }

    getUserInfo();
  }, [token, params.id]);

  useEffect(() => {
    if (isSuperAdmin) {
      setDropdownPair([
        { value: RoleEnum.USER, label: "Student" },
        { value: RoleEnum.ADMIN, label: "Admin" },
        { value: RoleEnum.SUPER_ADMIN, label: "Super Admin" },
      ]);
    } else if (adminInfo.id === userInfo?.id) {
      setDropdownPair([
        { value: RoleEnum.USER, label: "Student" },
        { value: RoleEnum.ADMIN, label: "Admin" },
      ]);
    } else {
      setDropdownPair([{ value: RoleEnum.USER, label: "Student" }]);
    }
  }, [isSuperAdmin, userInfo, adminInfo]);

  if (loading) {
    return <Loading />;
  }

  return (
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
                <p className="text-end">{userInfo?.username}</p>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400 gap-2">
                <p>Name: </p>
                <p className="text-end">{userInfo?.name}</p>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <p>Role: </p>
                <Badge
                  className={cn(
                    "text-xs rounded-full",
                    getRoleColor(userInfo?.role || RoleEnum.USER),
                  )}
                >
                  {userInfo?.role === RoleEnum.USER
                    ? "STUDENT"
                    : userInfo?.role}
                </Badge>
              </div>

              {/* Update details dialog */}
              <Dialog open={openDetails} onOpenChange={setOpenDetails}>
                <DialogTrigger
                  asChild
                  disabled={
                    !isSuperAdmin && userInfo?.role === RoleEnum.SUPER_ADMIN
                  }
                >
                  <Button
                    type="button"
                    className="cursor-pointer mt-4 w-full disabled:opacity-50"
                  >
                    Change Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-vscode-light dark:bg-vscode-dark">
                  <form onSubmit={detailsForm.handleSubmit(handleUpdateUser)}>
                    <DialogTitle>
                      Updating {userInfo?.name}&apos;s Details
                    </DialogTitle>
                    <div className="flex flex-col gap-2 mt-4 w-full">
                      <Input
                        className="py-5"
                        defaultValue={userInfo?.username}
                        placeholder="Username"
                        {...detailsForm.register("username")}
                      />
                      <p className="text-red-500 text-xs">
                        {detailsForm.formState.errors.username?.message}
                      </p>
                      <Input
                        className="py-5"
                        defaultValue={userInfo?.name}
                        placeholder="Name"
                        {...detailsForm.register("name")}
                      />
                      <p className="text-red-500 text-xs">
                        {detailsForm.formState.errors.name?.message}
                      </p>
                      <DropDownSelect
                        className="md:w-full py-5"
                        value={updateUserRole}
                        handleValueChange={(value) =>
                          setUpdateUserRole(value as RoleEnum)
                        }
                        placeholder="Role"
                        pairs={dropdownPair}
                      />
                      <Button type="submit" className="mt-2 cursor-pointer">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Update password dialog */}
              <Dialog open={openPassword} onOpenChange={setOpenPassword}>
                <DialogTrigger
                  asChild
                  disabled={
                    !isSuperAdmin && userInfo?.role === RoleEnum.SUPER_ADMIN
                  }
                >
                  <Button
                    type="button"
                    className="w-full mt-1 cursor-pointer bg-secondary disabled:opacity-50"
                  >
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-vscode-light dark:bg-vscode-dark">
                  <form
                    onSubmit={passwordForm.handleSubmit(handleChangePassword)}
                  >
                    <DialogTitle>Change Password</DialogTitle>
                    <div className="my-4 flex flex-col gap-2">
                      <Input
                        type="password"
                        placeholder="New Password"
                        className="py-5"
                        {...passwordForm.register("newPassword", {
                          required: "New Password is required",
                        })}
                      />
                      <p className="text-red-500 text-xs">
                        {passwordForm.formState.errors.newPassword?.message}
                      </p>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        className="py-5"
                        {...passwordForm.register("confirmPassword", {
                          required: "Confirm Password is required",
                        })}
                      />
                      <p className="text-red-500 text-xs">
                        {passwordForm.formState.errors.confirmPassword?.message}
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
        <Card className="w-full p-6 autoflow-y-auto">
          <CardTitle className="text-lg font-semibold">
            Recent Submissions
          </CardTitle>
          <CardContent className="p-0">
            <div className="w-full flex flex-col gap-2">
              {submissions.length === 0 ? (
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
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(submission.updatedAt).getMonth() +
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
    </section>
  );
};

export default Profile;
