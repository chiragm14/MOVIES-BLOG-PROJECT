import React from 'react'
import { useDispatch } from 'react-redux';
import authService from '../../services/authService';
import { logout } from '../../store/authSlice';

function LogoutBtn() {
    const dispatch = useDispatch();
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout());
        })
    }

    return (
        <button 
          className='inline-block text-xs font-semibold px-3.5 py-1.5 rounded-full text-gray-300 hover:text-white bg-gray-800/60 hover:bg-red-600/80 border border-gray-700/60 hover:border-red-500/50 transition-all'
          onClick={logoutHandler}
        >
            Logout
        </button>
    )
}

export default LogoutBtn;