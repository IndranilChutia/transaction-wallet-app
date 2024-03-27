import React from 'react';

const Navbar = () => {
    return (
        <div className='w-full px-12 py-6 border-b flex justify-between'>
            <h1 className='text-2xl font-semibold'>Digital Payments App</h1>
            <div className='flex items-center gap-4'>
                <h2>Hello, User</h2>
                <div className='rounded-full bg-gray-100 w-10 h-10 flex items-center justify-center font-semibold'>U</div>
            </div>
        </div>
    );
};

export default Navbar;