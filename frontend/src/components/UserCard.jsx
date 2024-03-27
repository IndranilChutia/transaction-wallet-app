import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from '@/components/ui/input';

import SendMoneyDialog from './SendMoneyDialog';


const UserCard = ({ id, firstName, lastName, username }) => {

    function combineInitials(firstName, lastName) {
        // Get the first letter of the first name (if exists)
        const firstInitial = firstName ? firstName.charAt(0) : '';
        // Get the first letter of the last name (if exists)
        const lastInitial = lastName ? lastName.charAt(0) : '';

        // Concatenate the first initials
        const initials = firstInitial + lastInitial;

        return initials.toUpperCase(); // Return the combined initials in uppercase
    }


    return (
        <div className='w-full py-2 flex justify-between items-center'>
            <div className='flex gap-2 justify-center items-center'>
                <Avatar>
                    <AvatarFallback className="text-slate-600">{combineInitials(firstName, lastName)}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                    <h3 className='capitalize'>{firstName} {lastName}</h3>
                    <p className='text-xs text-slate-500'>@{username}</p>
                </div>
            </div>
            <div>
                <SendMoneyDialog id={id} firstName={firstName} lastName={lastName} username={username} />
            </div>
        </div>
    );
};

export default UserCard;