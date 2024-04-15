'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin : 0;
    padding : 0;
    box-sizing : border-box;
  }  
`;
// 스타일 컴포넌트 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Form = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h2`
  margin-bottom: 1.5rem;
  color: #333;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorText = styled.div`
  color: red;
  margin-top: 0.5rem;
`;

const RegisterText = styled.a`
  margin-top: 10px;
  font-size: 13px;
`

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleLogin = async () => {
    const login_data = {
      user_email : username,
      user_pw : password
    }
    try{
      const response = await axios.post('http://localhost:4000/user/login',login_data);
      if(response.status === 201){
        localStorage.setItem('jwt',response.data);
        router.push('/');
      }else{
        setError('로그인에 실패하였습니다.')
      }
    }catch(error:any){
      setError(error.response.data.message)
    }
  };

  return (
    <>
    <GlobalStyle />
      <Container>
        <Form>
          <Heading>로그인</Heading>
          <div>
            <Label htmlFor="username">아이디:</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">비밀번호:</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleLogin}>로그인</Button>
          <RegisterText href='/register'>회원가입</RegisterText>
          {error && <ErrorText>{error}</ErrorText>}
        </Form>
      </Container>
    </>

  );
};

export default Login;
