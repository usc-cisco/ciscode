import { LoginRequestSchemaType, RegisterRequestSchemaType, UserResponseSchema, UserResponseSchemaType, UserResponseSchemaWithPassword } from "@/dtos/user.dto";
import { User } from "@/models/user.model";
import * as bcrypt from "bcryptjs";

class UserService {
    static async getUserById(userId: number) {
        const user = await User.findByPk(userId);
        return user;
    }

    static async registerAsUser(data: RegisterRequestSchemaType): Promise<UserResponseSchemaType> {
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