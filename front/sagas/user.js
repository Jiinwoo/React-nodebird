import {all,fork,takeLatest,call,put,takeEvery,delay} from 'redux-saga/effects';
import {LOG_IN_REQUEST,LOG_IN_FAILURE,LOG_IN_SUCCESS, 
    SIGN_UP_REQUEST,SIGN_UP_SUCCESS,SIGN_UP_FAILURE, LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE, LOAD_USER_REQUEST, LOAD_USER_FAILURE, LOAD_USER_SUCCESS} from '../reducers/user'
import axios from 'axios'


function loginAPI(loginData){
//서버에 요청을 보내는 부분
 return axios.post('/user/login/',loginData,{
     withCredentials:true,
 });
}
function* login(action){
    try{
        //yield call(loginAPI);//동기호출
        const result = yield call(loginAPI,action.data);
        yield put({//put 은 dispatch와 동일
            type:LOG_IN_SUCCESS,
            data:result.data,
        })
    }catch(e){// loginAPI실패
        console.error(e);
        yield put({
            type:LOG_IN_FAILURE,
            error:e
        })
    }
}
function* watchLogin(){
    //로그인 액션이 들어오면 
    yield takeLatest(LOG_IN_REQUEST,login);
}

function signUpAPI(signUpData){
    //서버에 요청을 보내는 부분
    return axios.post('/user/',signUpData);
}

function* signUp(action){
    try{
        //yield call(signUpAPI);//동기호출
        yield call(signUpAPI,action.data)
        yield put({//put 은 dispatch와 동일
            type:SIGN_UP_SUCCESS
        })
    }catch(e){// loginAPI실패
        console.error(e);
        yield put({
            type:SIGN_UP_FAILURE
        })
    }
}
function* watchSignup(){
    yield takeEvery(SIGN_UP_REQUEST,signUp);
}

function logoutAPI(){
    //서버에 요청을 보내는 부분
    return axios.post('/user/logout',{},{
        withCredentials:true
    });
}

function* logout(){
    try{
        //yield call(signUpAPI);//동기호출
        yield call(logoutAPI)
        yield put({//put 은 dispatch와 동일
            type:LOG_OUT_SUCCESS
        })
    }catch(e){// loginAPI실패
        console.error(e);
        yield put({
            type:LOG_OUT_FAILURE
        })
    }
}
function* watchLogout(){
    yield takeEvery(LOG_OUT_REQUEST,logout);
}

function loadUserAPI(userId){
    //서버에 요청을 보내는 부분
    return axios.get(userId ? `/user/${userId}` : '/user/',{
        withCredentials:true,
    });
}

function* loadUser(action){
    try{
        //yield call(signUpAPI);//동기호출
        const result = yield call(loadUserAPI,action.data)
        yield put({//put 은 dispatch와 동일
            type:LOAD_USER_SUCCESS,
            data : result.data,
            me : !action.data
        })
    }catch(e){// loginAPI실패
        console.error(e);
        yield put({
            type:LOAD_USER_FAILURE
        })
    }
}
function* watchLoadUser(){
    yield takeEvery(LOAD_USER_REQUEST,loadUser);
}



export default function* userSaga(){
    yield all([
        fork(watchLogin),//비동기 호출
        fork(watchLogout),
        fork(watchLoadUser),
        fork(watchSignup),
    ]);
}