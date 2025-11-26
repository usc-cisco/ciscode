"use client";

import { CategoryTable } from "@/components/shared/problem-table";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

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

  const getUniqueCategories = () => {
    const categoriesSet = new Set<string>();
    problems.forEach((problem) => {
      if (problem.categories) {
        problem.categories.forEach((cat) => categoriesSet.add(cat));
      }
    });
    return Array.from(categoriesSet).sort();
  };

  const getProblemsByCategory = (category: string) => {
    return problems.filter(
      (problem) => problem.categories && problem.categories.includes(category),
    );
  };

  const uniqueCategories = getUniqueCategories();

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
        <TabsList className="grid w-full grid-cols-4 vscode-light dark:bg-vscode-dark">
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

      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading...</p>
      ) : problems.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No problems found matching your criteria.
        </p>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={["all"]}
          className="w-full space-y-4"
        >
          {/* All Problems accordion - As requested by someone in the GDGoC Data Science Tech Space lol. */}
          <AccordionItem
            value="all"
            className="border rounded-lg bg-vscode-light dark:bg-vscode-dark"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline dark:bg-vscode-dark">
              <div className="flex items-center justify-between w-full mr-4">
                <span className="font-medium">All Problems</span>
                <Badge variant="outline" className="ml-2">
                  {problems.length} problem
                  {problems.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <CategoryTable problems={problems} inAdmin={inAdmin} />
            </AccordionContent>
          </AccordionItem>

          {/* The rest of the category accordions */}
          {uniqueCategories.map((category) => {
            const categoryProblems = getProblemsByCategory(category);
            return (
              <AccordionItem
                key={category}
                value={category}
                className="border rounded-lg bg-vscode-light dark:bg-vscode-dark"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline dark:bg-vscode-dark">
                  <div className="flex items-center justify-between w-full mr-4">
                    <span className="font-medium">
                      {category.replace(/^\./, "")}
                    </span>
                    <Badge variant="outline" className="ml-2">
                      {categoryProblems.length} problem
                      {categoryProblems.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <CategoryTable
                    problems={categoryProblems}
                    inAdmin={inAdmin}
                  />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </>
  );
};

export default ProblemContainer;
