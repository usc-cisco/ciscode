import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Info } from "lucide-react";
import { FieldValues, useForm } from "react-hook-form";
import { registerUser } from "@/lib/fetchers/user.fetchers";
import { RegisterRequestSchemaType } from "@/dtos/user.dto";

interface SignupFormProps {
  onSetLogin: () => void;
  handleSuccess: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSetLogin,
  handleSuccess,
}) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: FieldValues) => {
    try {
      await registerUser(data as RegisterRequestSchemaType);
      handleSuccess();
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-vscode-light dark:bg-vscode-dark p-4 rounded-md shadow-md flex flex-col gap-2 max-w-sm w-full"
    >
      <Input
        className="py-5"
        placeholder="Student ID"
        {...register("username")}
      />
      <Input
        className="py-5"
        placeholder="Password"
        type="password"
        {...register("password")}
      />
      <Input
        className="py-5"
        placeholder="Confirm Password"
        type="password"
        {...register("confirmPassword")}
      />
      <Button className="py-5 cursor-pointer" type="submit">
        Sign up
      </Button>

      <div className="text-gray-400 dark:text-gray-600 flex gap-1 items-start justify-center mt-4">
        <Info className="size-3 mt-[0.125rem]" />
        <p className="text-xs">
          Only DCISM users with valid Student IDs may sign up.
        </p>
      </div>

      <hr className="my-4" />

      <Button
        className="bg-green-500 hover:bg-green-400 py-5 cursor-pointer"
        type="button"
        onClick={onSetLogin}
      >
        Go to Log in
      </Button>
    </form>
  );
};

export default SignupForm;
