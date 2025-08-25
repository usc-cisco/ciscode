"use client";

import DropDownSelect from "@/components/home/drop-down-select";
import SearchBar from "@/components/home/search-bar";
import CustomPagination from "@/components/shared/custom-pagination";
import { useAuth } from "@/contexts/auth.context";
import env from "@/lib/env";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "../ui/button";
import RoleEnum, { getRoleColor } from "@/lib/types/enums/role.enum";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  RegisterRequestSchemaType,
  UserResponseSchemaType,
} from "@/dtos/user.dto";
import { addUserAsAdmin, fetchUsers } from "@/lib/fetchers/user.fetchers";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { toastr } from "@/lib/toastr";

const UserContainer = () => {
  const { token, isSuperAdmin } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const { register, handleSubmit, reset } =
    useForm<RegisterRequestSchemaType>();

  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(Number(params.get("page")) || 1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [rolesFilter, setRolesFilter] = useState<string>(
    params.get("roles") || "all",
  );
  const [filter, setFilter] = useState<string>(params.get("filter") || "");
  const [displayFilter, setDisplayFilter] = useState<string>(
    params.get("filter") || "",
  );
  const [users, setUsers] = useState<UserResponseSchemaType[]>([]);
  const [dropdownPair, setDropdownPair] = useState<
    { value: RoleEnum; label: string }[]
  >([]);
  const [open, setOpen] = useState(false);
  const [addUserRole, setAddUserRole] = useState<RoleEnum>(RoleEnum.USER);

  const createQueryString = useCallback(
    (data: { name: string; value: string }[]) => {
      const newParams = new URLSearchParams(params.toString());
      data.forEach(({ name, value }) => {
        newParams.set(name, value);
      });

      return newParams.toString();
    },
    [params],
  );

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
          router.push(
            "/admin?" + createQueryString([{ name: "page", value: "1" }]),
          );
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [token, page, rolesFilter, filter, createQueryString, router]);

  useEffect(() => {
    if (isSuperAdmin) {
      setDropdownPair([
        { value: RoleEnum.ADMIN, label: "Admin" },
        { value: RoleEnum.USER, label: "Student" },
      ]);
    } else {
      setDropdownPair([{ value: RoleEnum.USER, label: "Student" }]);
    }
  }, [isSuperAdmin]);

  const handleSearch: FormEventHandler = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on filter change
    setFilter(displayFilter);
    router.push(
      "/admin?" +
        createQueryString([
          { name: "page", value: "1" },
          { name: "filter", value: displayFilter },
        ]),
    );
  };

  const handleValueChange = (value: string) => {
    router.push(
      "/admin?" +
        createQueryString([
          { name: "page", value: "1" },
          { name: "roles", value },
        ]),
    );
    setPage(1);
    setRolesFilter(value);
  };

  const handlePageChange = (newPage: number) => {
    return () => {
      setPage(newPage);
    };
  };

  const handleRowClick = (userId: number) => {
    router.push(`/admin/user/${userId}`);
  };

  const handleAddUser = async (data: RegisterRequestSchemaType) => {
    if (!token) return;

    try {
      await addUserAsAdmin(
        {
          ...data,
          role: addUserRole,
        },
        token,
      );
      toastr.success("User added successfully");
      setOpen(false);
      setAddUserRole(RoleEnum.USER);
      reset();
    } catch (error) {
      console.error("Error adding user:", error);
      toastr.error(
        (error as { message: string }).message || "Error adding user",
      );
    }
  };

  return (
    <>
      <form
        className="flex flex-col sm:flex-row gap-4 mb-6"
        onSubmit={handleSearch}
      >
        <SearchBar
          searchTerm={displayFilter}
          handleChange={setDisplayFilter}
          placeholder="Search users..."
        />
        <DropDownSelect
          value={rolesFilter}
          handleValueChange={handleValueChange}
          placeholder="Roles"
          pairs={[
            { value: "all", label: "All Roles" },
            { value: RoleEnum.SUPER_ADMIN, label: "Super Admin" },
            { value: RoleEnum.ADMIN, label: "Admin" },
            { value: RoleEnum.USER, label: "Student" },
          ]}
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              className="cursor-pointer flex-1 md:flex-0 md:w-32"
            >
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-vscode-light dark:bg-vscode-dark">
            <form onSubmit={handleSubmit(handleAddUser)}>
              <DialogTitle>Add New User</DialogTitle>
              <div className="flex flex-col gap-2 mt-4 w-full">
                <Input
                  className="py-5"
                  placeholder="Username"
                  {...register("username")}
                />
                <Input
                  className="py-5"
                  placeholder="Name"
                  {...register("name")}
                />
                <Input
                  type="password"
                  className="py-5"
                  placeholder="Password"
                  {...register("password")}
                />
                <Input
                  type="password"
                  className="py-5"
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                />
                <DropDownSelect
                  className="md:w-full py-5"
                  value={addUserRole}
                  handleValueChange={(value) =>
                    setAddUserRole(value as RoleEnum)
                  }
                  placeholder="Role"
                  pairs={dropdownPair}
                />
                <Button type="submit" className="mt-2 cursor-pointer">
                  Add User
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </form>

      {/* Problems Table */}
      <div className="bg-vscode-light dark:bg-vscode-dark rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ||
              users.map((user, index) => (
                <TableRow
                  key={index}
                  onClick={() => handleRowClick(user.id)}
                  className="cursor-pointer odd:bg-neutral-100 odd:dark:bg-neutral-800"
                >
                  <TableCell className="truncate table-fixed flex-1">
                    <div className="font-medium">{user.username}</div>
                  </TableCell>
                  <TableCell className="truncate table-fixed">
                    <Badge variant="outline">{user.name}</Badge>
                  </TableCell>
                  <TableCell className="truncate table-fixed w-40">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role === RoleEnum.USER ? "STUDENT" : user.role}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading...</p>
      ) : (
        users.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No users found matching your criteria.
          </p>
        )
      )}
      {totalPages > 1 && (
        <div className="mt-8">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            createQueryString={createQueryString}
            path={"/admin"}
          />
        </div>
      )}
    </>
  );
};

export default UserContainer;
