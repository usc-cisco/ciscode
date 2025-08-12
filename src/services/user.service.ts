import { LoginRequestSchemaType, RegisterRequestSchemaType, UserResponseSchema, UserResponseSchemaType, UserResponseSchemaWithPassword } from "@/dtos/user.dto";
import RoleEnum from "@/lib/types/enums/role.enum";
import { User } from "@/models/user.model";
import * as bcrypt from "bcryptjs";
import { Model, Op } from "sequelize";

class UserService {
    static async getUserById(userId: number) {
        const user = await User.findByPk(userId);
        return user;
    }

    static async getUsers(offset: number = 0, limit: number = 10, search: string = "", role: RoleEnum | null = null): Promise<UserResponseSchemaType[]> {
        const users = await User.findAll({
            order: [["id", "ASC"]],
            offset: (offset) * limit,
            limit,
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${search}%`
                        },
                        username: {
                            [Op.like]: `%${search}%`
                        }
                    }
                ],
                ...(role && { role })
            },
        }) as (Model & UserResponseSchemaType)[];

        return users;
    }

    static async getTotalCount(): Promise<number> {
        const count = await User.count();
        return count;
    }

    static async getLastMonthCount(): Promise<number> {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const count = await User.count({
            where: {
                createdAt: {
                    [Op.gte]: lastMonth
                }
            }
        });
        return count;
    }

    static async addUser(data: RegisterRequestSchemaType): Promise<UserResponseSchemaType> {
        if (data.password !== data.confirmPassword) {
            throw new Error("Passwords do not match");
        }

        const existingUser = await User.findOne({ where: { username: data.username } });
        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await User.create({
            ...data,
            role: RoleEnum.USER,
            password: hashedPassword,
        });

        return UserResponseSchema.parse(user);
    }

    static async updateUser(data: RegisterRequestSchemaType): Promise<UserResponseSchemaType> {
        if (data.password !== data.confirmPassword) {
            throw new Error("Passwords do not match");
        }

        const existingUser = await User.findOne({ where: { username: data.username, password: null } });
        if (!existingUser) {
            throw new Error("Invalid Student ID");
        }

        const user = UserResponseSchema.parse(existingUser);

        const hashedPassword = await bcrypt.hash(data.password, 10);

        await User.update({
            ...data,
            password: hashedPassword,
        }, {
            where: { id: user.id },
            returning: true,
        });

        return user;
    }

    static async login(data: LoginRequestSchemaType): Promise<UserResponseSchemaType | null> {
        const userData = await User.findOne({ where: { username: data.username } });
        if (!userData) {
            return null;
        }

        const user = UserResponseSchemaWithPassword.parse(userData);
        if (!user.password) {
            return null;
        }

        const isValidPassword = await bcrypt.compare(data.password, user.password);
        if (!isValidPassword) {
            return null;
        }

        const response = UserResponseSchema.parse(user);
        return response;
    }
}

export default UserService;