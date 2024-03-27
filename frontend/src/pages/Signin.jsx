import React from 'react';
import { z } from "zod"
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const BASE_URL = import.meta.env.VITE_BASE_URL

// ShadCn Imports
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"



const formSchema = z.object({
    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
    }).min(3, { message: "Username must be longer than 3 chars!" }).trim().toLowerCase(),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).min(4,
        { message: "Password must be longer than 4 Characters!" }),
})
const Signin = () => {

    const navigate = useNavigate();


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    })

    async function onSubmit(values) {
        const parsedValues = formSchema.safeParse(values); // Attempt validation

        if (!parsedValues.success) {
            console.error("Form data is invalid:", parsedValues.error);
            // Handle validation errors (e.g., display error messages)
            return;
        }

        const data = parsedValues.data;

        try {
            const res = await axios.post(`${BASE_URL}/v1/user/signin`, data)

            if (res.status == "200") {
                alert(res.data.message)
                localStorage.setItem('token', res.data.token);
                navigate('/dashboard')
            } else {
                alert("Login Failed")
                throw new Error("Login Failed")
            }

        } catch (error) {
            console.log(error.response.data.message)
            alert(error.response.data.message)
        }

    }

    return (
        <div className='flex min-h-screen flex-col items-center justify-center'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xs w-full flex flex-col gap-4 border p-4 rounded-lg border-slate-200">
                    <div className='w-full flex flex-col items-center'>
                        <h1 className='text-2xl font-bold'>Sign In</h1>
                        <p className='text-center text-xs text-gray-500 my-1.5'>Enter your credentials to access your account</p>
                    </div>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Username" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Password" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">Sign In</Button>
                    <p className='text-center text-sm'>Don&apos;t have an account? <Link className="underline underline-offset-2" to='/signup'>SignUp!</Link></p>
                </form>
            </Form>
        </div>
    );
};

export default Signin;