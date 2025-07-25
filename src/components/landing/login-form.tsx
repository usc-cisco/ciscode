import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { loginUser } from '@/lib/fetchers/user.fetchers';
import { useForm } from 'react-hook-form';
import { Info } from 'lucide-react';
import Link from 'next/link';

type LoginFormInputs = {
  username: string;
  password: string;
};

interface LoginFormProps {
    onSetSignup: () => void;
    handleSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSetSignup, handleSuccess }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>();

    const onSubmit =  async (data: LoginFormInputs) => {
        try {
            await loginUser(data);
            handleSuccess();
        } catch (error) {
            console.error(error);
        }
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='bg-vscode-light dark:bg-vscode-dark p-4 rounded-md shadow-md flex flex-col gap-2 max-w-sm w-full'>
        <Input className='py-5' placeholder='Student ID' {...register('username')} />
        <Input className='py-5' placeholder='Password' type='password' {...register('password')} />
        <Button className='py-5' type='submit'>Log In</Button>

        <div className='text-primary flex justify-center mt-4'>
            <Link href="/forgot" className='text-sm font-semibold hover:underline cursor-pointer'>Forgot Password?</Link>
        </div>

        <hr className='my-4'/>

        <Button className='bg-green-500 hover:bg-green-400 py-5' type='button' onClick={onSetSignup}>Create New Account</Button>
    </form>
  )
}

export default LoginForm
