import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Protected = ({ Cmp }) => {
    const navigate = useNavigate();
    useEffect(() => {
        // if (!localStorage.getItem('user')) {
        if (!sessionStorage.getItem('user')) {
            navigate("/")
        }
    })
    return (
        <div>
            <Cmp />
        </div>
    )

};

export default Protected