"use client"
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const AdminApp = dynamic(() => import("./components/AdminApp"), { ssr: false });

const Home: NextPage = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLogin = () => {
        setIsLoggedIn(true)
    }
    useEffect(() => {
        // 서버로부터 로그인 상태 확인 API를 호출하여 로그인 상태를 설정합니다.
        const checkLoginStatus = async () => {
            
        };

        checkLoginStatus();
    }, []);

    return isLoggedIn ? <AdminApp /> : (
        <button onClick={handleLogin}>Login</button>
    );
};

export default Home;
