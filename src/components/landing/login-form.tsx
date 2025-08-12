import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { loginUser } from '@/lib/fetchers/user.fetchers';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/auth.context';
import { Info } from 'lucide-react';
import { toastr } from '@/lib/toastr';

type LoginFormInputs = {
  username: string;
  password: string;
};

interface LoginFormProps {
    onSetSignup: () => void;
    handleSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ handleSuccess }) => {
    const { setAuth } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormInputs>();

    const onSubmit =  async (data: LoginFormInputs) => {
      try {
          const response = await loginUser(data);
          setAuth(response.token);
          handleSuccess();
      } catch (error) {
          console.error(error);
          toastr.error((error as { message: string }).message || "An error occurred while logging in");
      }
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='bg-vscode-light dark:bg-vscode-dark p-4 rounded-md shadow-md flex flex-col gap-2 max-w-sm w-full'>
        <Input className='py-5' placeholder='Student ID or Username' {...register('username', { required: 'Username is required' })} />
        <p className='text-red-500 text-xs'>{errors.username?.message}</p>
        <Input className='py-5' placeholder='Password' type='password' {...register('password', { required: 'Password is required' })} />
        <p className='text-red-500 text-xs'>{errors.password?.message}</p>
        <Button className='py-5 cursor-pointer' type='submit'>Log In</Button>
        
        <div className='text-gray-400 dark:text-gray-600 flex gap-1 items-center justify-center mt-2'>
          <Info className='size-3'/>
          <p className='text-xs text-center'>Contact a CISCO member if you are unable to log in.</p>
        </div>

    </form>
  )
}

export default LoginForm
