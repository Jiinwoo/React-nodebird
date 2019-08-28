import React,{useCallback} from 'react';
import Link from 'next/link';
import {Form,Button,Input} from 'antd';
import {useDispatch,useSelector} from 'react-redux';
import {useInput} from '../pages/signup'
import { LOG_IN_REQUEST} from '../reducers/user';
const LoginForm = ()=>{
    const [id,onChangeId] = useInput('');
    const [password,onChangePassword] = useInput('');
    const {isLoggingIn} = useSelector(state=>state.user);

    const dispatch = useDispatch();
    const onSubmitForm = useCallback((e)=>{
        e.preventDefault();
        dispatch({
            type:LOG_IN_REQUEST,
            data :{
                userId:id,
                password,
            }
        });
        
    },[id,password]);
    return (
        <Form onSubmit={onSubmitForm} style={{padding:10}}>
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
    )
}
export default LoginForm;