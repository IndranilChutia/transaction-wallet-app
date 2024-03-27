import React from 'react';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';



const formSchema = z.object({
    amount: z.coerce.number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number",
    }).gt(0, { message: "Amount must be greater than 0" })
})

const SendMoneyDialog = ({ firstName, lastName, username, id }) => {


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0
        },
    })



    const onSubmit = async (values) => {
        const parsedValues = formSchema.safeParse(values); // Attempt validation

        if (!parsedValues.success) {
            console.error("Form data is invalid:", parsedValues.error);
            // Handle validation errors (e.g., display error messages)
            return;
        }

        const data = parsedValues.data;

        try {
            const res = await axios.post(`${BASE_URL}/v1/account/transfer`, {
                to: id,
                ...data
            }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.token}`
                }
            })

            console.log(res.data)
            alert(res.data.message)
            window.location.reload()
        } catch (error) {
            console.log(error.response.data)
            alert(error.response.data.message)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Send Money</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send money to <span className="capitalize">{firstName} {lastName}?</span></DialogTitle>
                    <DialogDescription>
                        Send money to @{username}. Enter an amount and click &apos;Send&apos;.
                    </DialogDescription>
                </DialogHeader>
                <div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter amount" type="number" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Amount should not exceed your balance.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex w-full justify-between'>
                                <DialogClose asChild>
                                    <Button variant="secondary">
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button type="submit">Send</Button>
                            </div>
                        </form>
                    </Form>

                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SendMoneyDialog;