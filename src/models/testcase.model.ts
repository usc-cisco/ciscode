import { sequelize } from "@/db/sequelize";
import { DataTypes } from "sequelize";

export const TestCase = sequelize.define("TestCase", {
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
    input: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    output: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    hidden: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    }}, 
{
    timestamps: true,
    paranoid: true,
});