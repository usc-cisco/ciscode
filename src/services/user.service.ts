import { LoginRequestSchemaType, RegisterRequestSchemaType, UserResponseSchema, UserResponseSchemaType, UserResponseSchemaWithPassword } from "@/dtos/user.dto";
import { User } from "@/models/user.model";
import { Sign } from "crypto";
import * as bcrypt from "bcryptjs";

class UserService {
    static async getUserById(userId: number) {
        const user = await User.findByPk(userId);
        return user;
    }

    static async register(data: RegisterRequestSchemaType): Promise<UserResponseSchemaType> {
        const existingUser = await User.findOne({ where: { username: data.username } });
        if (existingUser) {
            throw new Error("User with this username already exists");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = await User.create({
            ...data,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const response = UserResponseSchema.parse(newUser);
        return response;
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