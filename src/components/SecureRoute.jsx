import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Spinner from './spinner';
import { useNavigate } from 'react-router-dom';
const SecureRoute = ({ children }) => {
    const [loader, setLoader] = useState(true);
    const navigate = useNavigate()
    const API_URL = import.meta.env.VITE_API_URL;

    const checkAccess = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/mod/getAccess`,
                { withCredentials: true }
            );

            if (res.data.success) {
                setLoader(false)
            }
            else {
                navigate('/pageNotFound')
            }
            return res.data.success
        } catch (error) {
            navigate('/pageNotFound')
        }
    };

    useEffect(() => {
        const verifyAccess = async () => {
            const hasAccess = await checkAccess();
        };

        verifyAccess();
    }, []);

    return loader ? <Spinner /> : children;
};

export default SecureRoute;