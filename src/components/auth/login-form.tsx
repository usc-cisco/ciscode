import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { loginUser } from "@/lib/fetchers/user.fetchers";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/auth.context";
import { toastr } from "@/lib/toastr";
import Info from "../shared/info";
import { Eye, EyeClosed } from "lucide-react";

type LoginFormInputs = {
  username: string;
  password: string;
};

interface LoginFormProps {
  handleSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ handleSuccess }) => {
  const { setAuth } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoading(true);
      const response = await loginUser(data);
      setAuth(response.token);
      handleSuccess();
    } catch (error) {
      console.error(error);
      toastr.error(
        (error as { message: string }).message ||
          "An error occurred while logging in",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-vscode-light dark:bg-vscode-dark p-4 rounded-md shadow-md flex flex-col gap-2 max-w-sm w-full"
    >
      <Input
        className="py-5"
        placeholder="Student ID or Username"
        {...register("username", { required: "Username is required" })}
      />
      <p className="text-red-500 text-xs">{errors.username?.message}</p>
      <div className="relative">
        <Input
          className="py-5"
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          {...register("password", { required: "Password is required" })}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeClosed className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
      <p className="text-red-500 text-xs">{errors.password?.message}</p>
      <Button className="py-5 cursor-pointer" type="submit" disabled={loading}>
        {loading ? "Logging In..." : "Log In"}
      </Button>

      <Info text="Contact a CISCO member if you are unable to log in." />
    </form>
  );
};

export default LoginForm;
