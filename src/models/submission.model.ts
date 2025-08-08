import { sequelize } from "@/db/sequelize";
import ProblemStatusEnum from "@/lib/types/enums/problemstatus.enum";
import { DataTypes } from "sequelize";

export const Submission = sequelize.define("Submission", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    problemId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'Problems',
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    code: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(ProblemStatusEnum.ATTEMPTED, ProblemStatusEnum.SOLVED),
        allowNull: false,
        defaultValue: ProblemStatusEnum.ATTEMPTED,
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
    }
}, 
{
    timestamps: true,
});