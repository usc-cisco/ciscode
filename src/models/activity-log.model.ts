import { sequelize } from "@/db/sequelize";
import { ActionTypeEnum } from "@/lib/types/enums/actiontype.enum";
import { DataTypes } from "sequelize";

export const ActivityLog = sequelize.define(
  "ActivityLog",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    actionDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    actionType: {
      type: DataTypes.ENUM(
        ActionTypeEnum.SESSION_START,
        ActionTypeEnum.RUN_CODE,
        ActionTypeEnum.SUBMIT_CODE,
        ActionTypeEnum.CREATE,
        ActionTypeEnum.READ,
        ActionTypeEnum.UPDATE,
        ActionTypeEnum.DELETE,
      ),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  },
);
