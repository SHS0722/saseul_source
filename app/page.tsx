"use client"
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
const AdminApp = dynamic(() => import("./components/AdminApp"), { ssr: false });

const Home: NextPage = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        // 서버로부터 로그인 상태 확인 API를 호출하여 로그인 상태를 설정합니다.
        const checkLoginStatus = async () => {
            const jwt = localStorage.getItem('jwt');
            let myip = '';
            let server = 'http://15.164.77.173:4000/'
            let local_server = 'http://localhost:4000/'
            if(jwt === null){
                router.push('/login')
            }else {

                try{
                    const response = await axios.post(`${server}user/check`,null,{
                        headers: {
                            'Authorization': `Bearer ${jwt}`
                        }
                    });
                    if(response.status === 201){
                        setIsLoggedIn(true);
                    }else{
                        //토큰 재발급
                    }
                }catch(error){
                    router.push('/login')
                }
                
            }
        };

        checkLoginStatus();
    }, []);

    return isLoggedIn ? <AdminApp /> : null;
};

export default Home;
