// models/User.ts
import { DataTypes } from "sequelize";
import { sequelize } from "@/db/sequelize";
import RoleEnum from "@/lib/types/enums/role.enum";

export const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.USER),
        allowNull: false,
        defaultValue: RoleEnum.USER,
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