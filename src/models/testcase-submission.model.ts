import { sequelize } from "@/db/sequelize";
import SubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
import { DataTypes } from "sequelize";

export const TestCaseSubmission = sequelize.define("TestCaseSubmission", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    submissionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'Submissions',
            key: 'id',
        },
    },
    testCaseId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'TestCases',
            key: 'id',
        },
    },
    output: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    error: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM(SubmissionStatusEnum.COMPLETED, SubmissionStatusEnum.PENDING, SubmissionStatusEnum.FAILED),
        allowNull: false,
        defaultValue: SubmissionStatusEnum.PENDING,
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
    tableName: 'TestCaseSubmissions',
    paranoid: true,
});