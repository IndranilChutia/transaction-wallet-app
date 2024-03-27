import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Protected = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const login = localStorage.getItem("token");
        if (!login) {
            navigate("/signup");
        }
    }, [navigate]);


    return (
        <>
            {children}
        </>
    );
};

export default Protected;