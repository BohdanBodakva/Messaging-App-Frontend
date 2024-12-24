import React from 'react';
import './Layout.css';
import LoginForm from "../Login/LoginForm";
import SignupForm from "../Login/SignupForm";
import Login from "../Login/Login";
import Chats from "../Chats/Chats";

function Layout () {


    return (
        <div className="layout">
            <Chats></Chats>
        </div>
    );
}


export default Layout;
