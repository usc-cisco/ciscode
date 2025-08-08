import { sequelize } from "@/db/sequelize";
import DifficultyEnum from "@/lib/types/enums/difficulty.enum";
import { DataTypes } from "sequelize";

export const Problem = sequelize.define("Problem", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    difficulty: {
        type: DataTypes.ENUM(DifficultyEnum.PROG1, DifficultyEnum.PROG2, DifficultyEnum.DSA), 
        allowNull: false,
    },
    defaultCode: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    solutionCode: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "",
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    authorId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
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
    }
}, 
{
    timestamps: true,
    paranoid: true,
});