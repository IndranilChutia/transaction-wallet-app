import React from 'react';

const Navbar = () => {
    return (
        <div className='w-full px-12 py-6 border-b flex justify-between'>
            <h1 className=' md:text-2xl font-semibold'>Digital Payments App</h1>
            <div className='flex items-center gap-4'>
                <h2 className='text-sm'>Hello, User</h2>
                <div className='rounded-full bg-gray-100 w-6 h-6 md:w-10 md:h-10  text-xs md:text-base flex items-center justify-center font-semibold'>U</div>
            </div>
        </div>
    );
};

export default Navbar;