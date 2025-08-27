"use client";

import DropDownSelect from "@/components/home/drop-down-select";
import SearchBar from "@/components/home/search-bar";
import CustomPagination from "@/components/shared/custom-pagination";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/auth.context";
import { ActivityLogResponseType } from "@/dtos/activity-log.dto";
import env from "@/lib/env";
import { fetchLogs } from "@/lib/fetchers/activity-log.fetchers";
import {
  ActionTypeEnum,
  getActionTypeColor,
} from "@/lib/types/enums/actiontype.enum";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";

const ActivityPage = () => {
  const { token } = useAuth();

  const params = useSearchParams();
  const router = useRouter();

  const [logs, setLogs] = useState<ActivityLogResponseType[]>([]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(Number(params.get("page")) || 1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [actionTypeFilter, setActionTypeFilter] = useState(
    params.get("actionType") || "all",
  );
  const [filter, setFilter] = useState(params.get("filter") || "");
  const [displayFilter, setDisplayFilter] = useState(
    params.get("filter") || "",
  );

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
    const getLogs = async () => {
      try {
        const response = await fetchLogs(
          token ?? "",
          page,
          env.ACTIVITY_LOG_LIMIT_PER_PAGE,
          filter,
          actionTypeFilter !== "all" ? actionTypeFilter : null,
        );
        setLogs(response.data.logs || []);
        setTotalPages(response.data.totalPages || 1);

        if (response.data.logs.length === 0) {
          setPage(1);
          setTotalPages(1);
          router.push(
            "/admin/activity?" +
              createQueryString([{ name: "page", value: "1" }]),
          );
        }
      } catch (error) {
        console.error("Error fetching activity logs:", error);
      } finally {
        setLoading(false);
      }
    };

    getLogs();
  }, [token, page, actionTypeFilter, filter, createQueryString, router]);

  const handleSearch: FormEventHandler = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on filter change
    setFilter(displayFilter);
    router.push(
      "/admin/activity?" +
        createQueryString([
          { name: "page", value: "1" },
          { name: "filter", value: displayFilter },
        ]),
    );
  };

  const handleValueChange = (value: string) => {
    router.push(
      "/admin/activity?" +
        createQueryString([
          { name: "page", value: "1" },
          { name: "actionType", value },
        ]),
    );
    setPage(1);
    setActionTypeFilter(value);
  };

  const handlePageChange = (newPage: number) => {
    return () => {
      setPage(newPage);
    };
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h3 className="text-2xl font-bold">Activity Logs</h3>
          <p>Overview of user activity and engagement</p>
        </div>

        <>
          <form
            className="flex flex-col sm:flex-row gap-4 mb-6"
            onSubmit={handleSearch}
          >
            <SearchBar
              searchTerm={displayFilter}
              handleChange={setDisplayFilter}
              placeholder="Search logs..."
            />
            <DropDownSelect
              value={actionTypeFilter}
              handleValueChange={handleValueChange}
              placeholder="Activity Type"
              pairs={[
                { value: "all", label: "All Types" },
                { value: ActionTypeEnum.CREATE, label: "Create" },
                { value: ActionTypeEnum.READ, label: "Read" },
                { value: ActionTypeEnum.UPDATE, label: "Update" },
                { value: ActionTypeEnum.DELETE, label: "Delete" },
                { value: ActionTypeEnum.SESSION_START, label: "Session Start" },
                { value: ActionTypeEnum.RUN_CODE, label: "Run Code" },
                { value: ActionTypeEnum.SUBMIT_CODE, label: "Submit Code" },
              ]}
            />
          </form>

          {/* Problems Table */}
          <div className="bg-vscode-light dark:bg-vscode-dark rounded-lg shadow overflow-hidden">
            <Table className="table-auto md:table-fixed w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Timestamp</TableHead>
                  <TableHead className="w-20">Actor</TableHead>
                  <TableHead className="min-w-52">Description</TableHead>
                  <TableHead className="w-32">Action Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ||
                  logs.map((log, index) => (
                    <TableRow
                      key={index}
                      onClick={() => router.push(`/admin/user/${log.userId}`)}
                      className="cursor-pointer odd:bg-neutral-100 odd:dark:bg-neutral-800"
                    >
                      <TableCell className="truncate text-xs">
                        <Badge variant="outline">
                          {new Date(log.createdAt).toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell className="truncate text-xs">
                        <Badge variant="outline">{log.userId}</Badge>
                      </TableCell>
                      <TableCell className="w-full overflow-hidden text-xs">
                        <div className="font-medium text-wrap ">
                          {log.actionDescription}
                        </div>
                      </TableCell>
                      <TableCell className="truncate text-xs">
                        <Badge className={getActionTypeColor(log.actionType)}>
                          {log.actionType}
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
            logs.length === 0 && (
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
                path={"/admin/activity"}
              />
            </div>
          )}
        </>
      </div>
    </section>
  );
};

export default ActivityPage;
