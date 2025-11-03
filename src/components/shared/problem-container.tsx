"use client";

import ProblemTable from "@/components/shared/problem-table";
import SearchBar from "@/components/shared/search-bar";
import { useAuth } from "@/contexts/auth.context";
import { ProblemSchemaDisplayResponseType } from "@/dtos/problem.dto";
import { fetchProblems } from "@/lib/fetchers/problem.fetchers";
import { DifficultyEnum } from "@/lib/types/enums/difficulty.enum";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "../ui/button";
import DropDownMultiSelect from "./drop-down-multi-select";
import { CategoryEnum } from "@/lib/types/enums/category.enum";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProblemContainerProps {
  inAdmin?: boolean;
  verified?: boolean;
}

const ProblemContainer = ({
  inAdmin,
  verified = true,
}: ProblemContainerProps) => {
  const { token } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const path = inAdmin ? "/admin" : "/home";

  const [loading, setLoading] = useState<boolean>(true);

  const [difficultyFilter, setDifficultyFilter] = useState<string>(
    params.get("difficulty") || "all",
  );
  const [filter, setFilter] = useState<string>(params.get("filter") || "");
  const [displayFilter, setDisplayFilter] = useState<string>(
    params.get("filter") || "",
  );
  const [categoriesFilter, setCategoriesFilter] = useState<string[]>(
    params.get("categories") ? params.get("categories")!.split(",") : [],
  );
  const [problems, setProblems] = useState<ProblemSchemaDisplayResponseType[]>(
    [],
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

    // Fetch problems based on filters
    const getProblems = async () => {
      try {
        const response = await fetchProblems(
          token ?? "",
          1, // Always fetch first page
          1000, // Fetch all problems for accordion view
          filter,
          difficultyFilter !== "all" ? difficultyFilter : null,
          categoriesFilter.length > 0 ? categoriesFilter : null,
          verified,
        );
        setProblems(response.data.problems || []);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    getProblems();
  }, [token, filter, difficultyFilter, categoriesFilter, verified]);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setFilter(displayFilter);
    router.push(
      path +
        "?" +
        createQueryString([{ name: "filter", value: displayFilter }]),
    );
  };

  const handleDifficultyChange = (value: string) => {
    router.push(
      path + "?" + createQueryString([{ name: "difficulty", value }]),
    );
    setDifficultyFilter(value);
  };

  const handleTopicsChange = (values: string[]) => {
    router.push(
      path +
        "?" +
        createQueryString([{ name: "categories", value: values.join(",") }]),
    );
    setCategoriesFilter(values);
  };

  return (
    <>
      <form
        className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6"
        onSubmit={handleSubmit}
      >
        <SearchBar
          searchTerm={displayFilter}
          handleChange={setDisplayFilter}
          placeholder="Search problems..."
        />
        <DropDownMultiSelect
          values={categoriesFilter}
          handleValueChange={handleTopicsChange}
          placeholder="Categories"
          pairs={Object.values(CategoryEnum).map((category) => ({
            value: category,
            label: category,
          }))}
        />
        {verified && (
          <Button
            type="button"
            className="cursor-pointer flex-1 md:flex-0 md:w-32"
            onClick={() =>
              inAdmin
                ? router.push("/admin/problem/add")
                : router.push("/problem/offer")
            }
          >
            {inAdmin ? "Add Problem" : "Offer Problem"}
          </Button>
        )}
      </form>

      <Tabs
        value={difficultyFilter}
        onValueChange={handleDifficultyChange}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value={DifficultyEnum.PROG1}>
            {DifficultyEnum.PROG1}
          </TabsTrigger>
          <TabsTrigger value={DifficultyEnum.PROG2}>
            {DifficultyEnum.PROG2}
          </TabsTrigger>
          <TabsTrigger value={DifficultyEnum.DSA}>
            {DifficultyEnum.DSA}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Problems Table */}
      <ProblemTable problems={problems} inAdmin={inAdmin} loading={loading} />
    </>
  );
};

export default ProblemContainer;
