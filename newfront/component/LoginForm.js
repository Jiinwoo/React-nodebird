import React, {useCallback,useState} from 'react'
import Link from 'next/link';
import {Form, Input, Button} from 'antd';

export const useInput = (initValue = null)=>{
    const [value,setter] = useState(initValue);
    const handler = useCallback((e)=>{
        setter(e.target.value);
    },[]);
    return [value,handler];
}

const LoginForm = ()=>{
    
    const [id,onChangeId] = useInput('');
    const [password,onChangePassword] = useInput('');
    const [isLoggingIn,setIsLoggingIn] = useState(false);

    const onSubmitForm = useCallback((e)=>{
        e.preventDefault();
    },{id,password});

    return <Form onSubmit={onSubmitForm} style={{padding:10}}>
        <div>
            <label htmlFor="user-id">아이디</label>
            <br/>
            <Input name="user-id" value={id} onChange={onChangeId} required/>
        </div>
        <div>
            <label htmlFor="user-password">패스워드</label>
            <br/>
            <Input name="user-password" value={password} onChange={onChangePassword}type="password"  required />
        </div>
        <div style={{marginTop:'10px'}}>
            <Button type="primary" htmlType="submit" loading={isLoggingIn}>로그인</Button>
            <Button><Link href="/signup"><a>회원 가입</a></Link></Button>
        </div>
    </Form>
}
export default LoginForm;