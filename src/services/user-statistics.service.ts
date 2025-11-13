import { UserStatisticsType } from "@/dtos/user-statistics.dto";
import { DifficultyEnum } from "@/lib/types/enums/difficulty.enum";
import SubmissionStatusEnum from "@/lib/types/enums/problemstatus.enum";
import { Problem, Submission } from "@/models";
import { Op } from "sequelize";
import { sequelize } from "@/db/sequelize";

class UserStatisticsService {
  static async getUserStatistics(userId: number): Promise<UserStatisticsType> {
    const solvedProblems = await Submission.findAll({
      attributes: ["problemId"],
      where: {
        userId,
        status: SubmissionStatusEnum.SOLVED,
      },
      include: [
        {
          model: Problem,
          as: "problem",
          attributes: ["difficulty"],
          required: true,
        },
      ],
      group: ["problemId", "problem.difficulty"],
    });

    const solvedByDifficulty = {
      [DifficultyEnum.PROG1]: 0,
      [DifficultyEnum.PROG2]: 0,
      [DifficultyEnum.DSA]: 0,
    };

    solvedProblems.forEach((submission) => {
      const submissionData = submission.get({ plain: true }) as {
        problem?: { difficulty?: string };
      };
      const difficulty = submissionData.problem?.difficulty;
      if (difficulty && difficulty in solvedByDifficulty) {
        solvedByDifficulty[difficulty as keyof typeof solvedByDifficulty]++;
      }
    });

    const totalByDifficulty = {
      [DifficultyEnum.PROG1]: await Problem.count({
        where: { difficulty: DifficultyEnum.PROG1, verified: true },
      }),
      [DifficultyEnum.PROG2]: await Problem.count({
        where: { difficulty: DifficultyEnum.PROG2, verified: true },
      }),
      [DifficultyEnum.DSA]: await Problem.count({
        where: { difficulty: DifficultyEnum.DSA, verified: true },
      }),
    };

    const totalProblems = await Problem.count({ where: { verified: true } });

    const totalSolved = Object.values(solvedByDifficulty).reduce(
      (sum, count) => sum + count,
      0,
    );

    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    const submissions = await Submission.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("updatedAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        userId,
        updatedAt: {
          [Op.gte]: oneYearAgo,
        },
      },
      group: [sequelize.fn("DATE", sequelize.col("updatedAt"))],
      raw: true,
    });

    const submissionCalendar = (
      submissions as unknown as { date: string; count: string | number }[]
    ).map((entry) => ({
      date: entry.date,
      count:
        typeof entry.count === "string" ? parseInt(entry.count) : entry.count,
    }));

    const totalSubmissions = submissionCalendar.reduce(
      (sum, entry) => sum + entry.count,
      0,
    );

    const activeDays = submissionCalendar.length;

    const maxStreak = this.calculateMaxStreak(
      submissionCalendar.map((e) => e.date),
    );

    return {
      totalSolved,
      totalProblems,
      solvedByDifficulty,
      totalByDifficulty,
      submissionCalendar,
      totalSubmissions,
      activeDays,
      maxStreak,
    };
  }

  private static calculateMaxStreak(dates: string[]): number {
    if (dates.length === 0) return 0;

    const sortedDates = dates.sort();

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);

      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
      // If diffDays === 0, same day, don't change streak
    }

    return maxStreak;
  }
}

export default UserStatisticsService;
