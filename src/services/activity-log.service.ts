import { ActivityLogResponseType } from "@/dtos/activity-log.dto";
import { ActionTypeEnum } from "@/lib/types/enums/actiontype.enum";
import { ActivityLog } from "@/models/activity-log.model";
import { Model, Op } from "sequelize";

class ActivityLogService {
  static async createLogEntry(
    userId: number,
    actionDescription: string,
    actionType: ActionTypeEnum,
  ) {
    return ActivityLog.create({
      userId,
      actionDescription,
      actionType,
    });
  }

  static async getLogs(
    offset: number = 0,
    limit: number = 10,
    search: string = "",
    actionType?: ActionTypeEnum,
  ) {
    const where = {
      ...(search && { actionDescription: { [Op.like]: `%${search}%` } }),
      ...(actionType && { actionType }),
    };

    const logs = (await ActivityLog.findAll({
      where,
      offset: offset * limit,
      limit,
      order: [["createdAt", "DESC"]],
    })) as (Model & ActivityLogResponseType)[];

    return logs;
  }

  static async getTotalCount(search: string = "", actionType?: ActionTypeEnum) {
    const where = {
      ...(search && { actionDescription: { [Op.like]: `%${search}%` } }),
      ...(actionType && { actionType }),
    };

    return ActivityLog.count({
      where,
    });
  }

  static async getUserLogs(userId: number) {
    return ActivityLog.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
  }

  static async deleteLogEntry(logId: number) {
    return ActivityLog.destroy({
      where: { id: logId },
    });
  }
}

export default ActivityLogService;
