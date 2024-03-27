import Navbar from '@/components/Navbar';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import _ from 'lodash';
import UserCard from '@/components/UserCard';
import { Button } from '@/components/ui/button';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    const [search, setSearch] = useState("")

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const res = await axios.get(`${BASE_URL}/v1/account/balance`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.token}`
                }
            })

            console.log(res.data.balance)
            setBalance(Number(res.data.balance));

        }

        fetch();
    }, [])

    const fetchUsers = async (e) => {
        setSearch(e.target.value)
    }

    const debounceFetchUsers = _.debounce(fetchUsers, 1000)

    useEffect(() => {
        const fetch = async () => {
            const res = await axios.get(`${BASE_URL}/v1/user/bulk?filter=${search}`)
            setUsers(res.data.users)
            console.log(res.data.users)
        }

        fetch();
    }, [search])

    const logout = () => {
        localStorage.removeItem('token');
        window.location.reload()
    }


    return (
        <div>
            <Navbar />
            <div className='px-12 py-6'>
                <div className='flex w-full justify-between items-center'>
                    <h2 className='text-xl font-medium'>Your Balance: ₹{balance}</h2>
                    <Button variant="secondary" onClick={logout}>Log Out</Button>
                </div>
                <h2 className='mt-8 font-medium'>Search Users</h2>
                <Input className="mt-2" placeholder="Enter First or Last Name..." onChange={debounceFetchUsers} />


                <div className='flex flex-col gap-2 mt-6'>
                    {users?.map(item => {
                        return (
                            <div key={item?._id}>
                                <UserCard id={item?._id} firstName={item?.firstName} lastName={item?.lastName} username={item?.username} />
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;