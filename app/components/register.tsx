'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin : 0;
    padding : 0;
  }  
`;
// 스타일 컴포넌트 정의
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Form = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width : 500px;
`;
const Box = styled.div`
display: flex;
flex-direction: column;
  width : 80%
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
  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
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

const LoginText = styled.a`
  margin-top: 10px;
  font-size: 13px;
`

const Register = () => {
  const [userid, setUserid] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [checkpw, setCheckPw] = useState('');
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');

  const router = useRouter();

  const handleLogin = async () => {
    if(username === ''){
        setError('이름을 입력해주세요.')
        return;
    }
    if(phone === ''){
        setError('전화번호를 입력해주세요.')
        return;
    }
    if(phone.length !== 11){
        setError('전화번호는 11자리로 입력해주세요.')
        return;
    }
    if(userid === ''){
        setError('아이디를 입력해주세요.');
        return;
    }
    if(password === ''){
        setError('비밀번호를 입력해주세요.')
        return;
    }
    if(password === checkpw){
        //회원가입 ㄱㄱ
        const register_data = {
          user_email : userid,
          user_pw : password,
          user_name : username,
          user_phone : phone
        }
        try{
          const response = await axios.post('http://15.164.77.173:4000/user/',register_data);
          if(response.status === 201){
            localStorage.setItem('jwt',response.data);
            router.push('/');
          }else{
            setError('로그인에 실패하였습니다.')
          }
        }catch(error:any){
          setError(error.response.data.message)
        }
    }
  };

  return (
    <>
    <GlobalStyle />
      <Container>
        <Form>
          <Heading>회원가입</Heading>
            <Box>
            <Label htmlFor="username">이름:</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Label htmlFor="phone">전화번호:</Label>
            <Input
              type="number"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Label htmlFor="userid">아이디:</Label>
            <Input
              type="text"
              id="userid"
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
            />


            <Label htmlFor="password">비밀번호:</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Label htmlFor="password">비밀번호 확인:</Label>
            <Input
              type="password"
              id="password"
              value={checkpw}
              onChange={(e) => {setCheckPw(e.target.value); if(password !== e.target.value){setError('비밀번호가 서로 맞지 않습니다.'); return;} setError('')}}
            />

          <Button onClick={handleLogin}>회원가입</Button>
          <LoginText href='/login'>아이디가 이미 있어요.</LoginText>
          {error && <ErrorText>{error}</ErrorText>}
          </Box>
        </Form>
      </Container>
    </>

  );
};

export default Register;
