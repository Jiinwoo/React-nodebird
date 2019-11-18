import {all,fork,takeLatest,call,put,takeEvery,delay} from 'redux-saga/effects';
import {LOG_IN_REQUEST,LOG_IN_FAILURE,LOG_IN_SUCCESS, 
    SIGN_UP_REQUEST,SIGN_UP_SUCCESS,SIGN_UP_FAILURE, LOG_OUT_REQUEST, 
    LOG_OUT_SUCCESS, LOG_OUT_FAILURE, LOAD_USER_REQUEST, LOAD_USER_FAILURE, 
    LOAD_USER_SUCCESS, UNFOLLOW_USER_FAILURE, UNFOLLOW_USER_SUCCESS, UNFOLLOW_USER_REQUEST,
    FOLLOW_USER_FAILURE,FOLLOW_USER_SUCCESS,FOLLOW_USER_REQUEST,
    LOAD_FOLLOWERS_SUCCESS,LOAD_FOLLOWERS_REQUEST,LOAD_FOLLOWERS_FAILURE,
    LOAD_FOLLOWINGS_SUCCESS,LOAD_FOLLOWINGS_REQUEST,LOAD_FOLLOWINGS_FAILURE,
    REMOVE_FOLLOWER_SUCCESS,REMOVE_FOLLOWER_REQUEST,REMOVE_FOLLOWER_FAILURE,
    EDIT_NICKNAME_SUCCESS,EDIT_NICKNAME_REQUEST,EDIT_NICKNAME_FAILURE,
    } from '../reducers/user'
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
            reason:e.reponse && e.response.data
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
//팔로우 언팔
function followAPI(userId){
    //서버에 요청을 보내는 부분
    return axios.post(`/user/${userId}/follow`,{},{
        withCredentials:true,
    });
}

function* follow(action){
    try{
        //yield call(signUpAPI);//동기호출
        const result = yield call(followAPI,action.data)
        yield put({//put 은 dispatch와 동일
            type:FOLLOW_USER_SUCCESS,
            data : result.data,
        })
    }catch(e){// loginAPI실패
        console.error(e);
        yield put({
            type:FOLLOW_USER_FAILURE
        })
    }
}
function* watchFollow(){
    yield takeEvery(FOLLOW_USER_REQUEST,follow);
}
function unfollowAPI(userId){
    //서버에 요청을 보내는 부분
    return axios.delete(`/user/${userId}/follow`,{
        withCredentials:true,
    });
}

function* unfollow(action){
    try{
        //yield call(signUpAPI);//동기호출
        const result = yield call(unfollowAPI,action.data)
        yield put({//put 은 dispatch와 동일
            type:UNFOLLOW_USER_SUCCESS,
            data : result.data,
        })
    }catch(e){// loginAPI실패
        console.error(e);
        yield put({
            type:UNFOLLOW_USER_FAILURE
        })
    }
}
function* watchUnfollow(){
    yield takeEvery(UNFOLLOW_USER_REQUEST,unfollow);
}
//팔로워 목록 불러오기
function loadFollowersAPI(userId, offset = 0,limit=3){
    return axios.get(`/user/${userId || 0}/followers?offset=${offset}&limit=${limit}`,{
        withCredentials:true,
    });
}

function* loadFollowers(action){
    try{
        const result = yield call(loadFollowersAPI,action.data,action.offset)
        yield put({
            type:LOAD_FOLLOWERS_SUCCESS,
            data : result.data,
        })
    }catch(e){
        console.error(e);
        yield put({
            type:LOAD_FOLLOWERS_FAILURE
        })
    }
}
function* watchLoadFollowers(){
    yield takeEvery(LOAD_FOLLOWERS_REQUEST,loadFollowers);
}
//팔로잉 목록 불러오기
function loadFollowingsAPI(userId, offset = 0,limit=3){
    return axios.get(`/user/${userId || 0}/followings?offset=${offset}&limit=${limit}`,{
        withCredentials:true,
    });
}

function* loadFollowings(action){
    try{
        const result = yield call(loadFollowingsAPI,action.data,action.offset)
        yield put({
            type:LOAD_FOLLOWINGS_SUCCESS,
            data : result.data,
        })
    }catch(e){
        console.error(e);
        yield put({
            type:LOAD_FOLLOWINGS_FAILURE
        })
    }
}
function* watchLoadFollowings(){
    yield takeEvery(LOAD_FOLLOWINGS_REQUEST,loadFollowings);
}
// 팔로워 지우기
function removeFollowerAPI(userId){
    return axios.delete(`/user/${userId}/follower`,{
        withCredentials:true,
    });
}

function* removeFollower(action){
    try{
        const result = yield call(removeFollowerAPI,action.data)
        yield put({
            type:REMOVE_FOLLOWER_SUCCESS,
            data : result.data,
        })
    }catch(e){
        console.error(e);
        yield put({
            type:REMOVE_FOLLOWER_FAILURE
        })
    }
}
function* watchRemoveFollower(){
    yield takeEvery(REMOVE_FOLLOWER_REQUEST,removeFollower);
}
//닉네임 수정
function editNicknameAPI(nickname){
    return axios.patch('/user/nickname',{nickname},{
        withCredentials:true,
    });
}

function* editNickname(action){
    try{
        const result = yield call(editNicknameAPI,action.data)
        yield put({
            type:EDIT_NICKNAME_SUCCESS,
            data : result.data,
        })
    }catch(e){
        console.error(e);
        yield put({
            type:EDIT_NICKNAME_FAILURE
        })
    }
}
function* watchEditNickname(){
    yield takeEvery(EDIT_NICKNAME_REQUEST,editNickname);
}

export default function* userSaga(){
    yield all([
        fork(watchLogin),//비동기 호출
        fork(watchLogout),
        fork(watchLoadUser),
        fork(watchSignup),
        fork(watchFollow),
        fork(watchUnfollow),
        fork(watchLoadFollowers),
        fork(watchLoadFollowings),
        fork(watchRemoveFollower),
        fork(watchEditNickname)

    ]);
}